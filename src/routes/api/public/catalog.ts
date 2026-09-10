import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { createHash, timingSafeEqual } from "node:crypto";

import { CATEGORIES, ITEMS, type Category } from "@/data/items";

export type CatalogOverride = { category: Category; price: number };
export type CatalogLogEntry = { date: string; changes: string[] };
export type Catalog = {
  overrides: Record<string, CatalogOverride>;
  log: CatalogLogEntry[];
};

const EMPTY: Catalog = { overrides: {}, log: [] };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "cache-control": "no-store",
    },
  });

/** Porównanie odporne na atak czasowy. */
function pinMatches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function normalize(value: unknown): Catalog {
  const v = (value ?? {}) as Partial<Catalog>;
  const overrides: Record<string, CatalogOverride> = {};
  for (const [name, raw] of Object.entries(v.overrides ?? {})) {
    const o = raw as Partial<CatalogOverride>;
    if (!name || typeof o?.price !== "number" || !Number.isFinite(o.price))
      continue;
    if (!CATEGORIES.includes(o.category as Category)) continue;
    overrides[name.slice(0, 120)] = {
      category: o.category as Category,
      price: Math.max(0, Math.round(o.price)),
    };
  }
  const log = (Array.isArray(v.log) ? v.log : [])
    .filter(
      (e): e is CatalogLogEntry =>
        !!e && typeof e.date === "string" && Array.isArray(e.changes),
    )
    .slice(0, 60)
    .map((e) => ({
      date: e.date,
      changes: e.changes.filter((c) => typeof c === "string").slice(0, 50),
    }));
  return { overrides, log };
}

async function readCatalog(): Promise<Catalog> {
  const { data, error } = await publicClient()
    .from("app_settings")
    .select("value")
    .eq("key", "catalog")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return normalize(data?.value);
}

/** Data w strefie Warszawy — używana w changelogu. */
function today() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
  }).format(new Date());
}

function appendLog(log: CatalogLogEntry[], change: string): CatalogLogEntry[] {
  const date = today();
  const next = log.map((e) => ({ ...e, changes: [...e.changes] }));
  if (next[0]?.date === date) {
    next[0].changes = [change, ...next[0].changes].slice(0, 50);
    return next;
  }
  return [{ date, changes: [change] }, ...next].slice(0, 60);
}

const nf = new Intl.NumberFormat("pl-PL");

export const Route = createFileRoute("/api/public/catalog")({
  server: {
    handlers: {
      OPTIONS: async () => json({ ok: true }),

      GET: async () => {
        try {
          return json({ catalog: await readCatalog() });
        } catch {
          return json({ catalog: EMPTY });
        }
      },

      POST: async ({ request }) => {
        const expected = process.env["ADMIN_PIN"];
        if (!expected) return json({ error: "Brak konfiguracji PIN." }, 500);

        let body: {
          pin?: unknown;
          action?: unknown;
          name?: unknown;
          category?: unknown;
          price?: unknown;
        };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return json({ error: "Nieprawidłowe dane." }, 400);
        }

        const pin = typeof body.pin === "string" ? body.pin : "";
        if (!pin || !pinMatches(pin, expected)) {
          return json({ ok: false, error: "Nieprawidłowy PIN." }, 401);
        }

        const name =
          typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
        if (!name) return json({ error: "Podaj nazwę produktu." }, 400);

        let catalog: Catalog;
        try {
          catalog = await readCatalog();
        } catch {
          return json({ error: "Nie udało się odczytać cennika." }, 500);
        }

        const base = ITEMS.find((i) => i.name === name);
        const current = catalog.overrides[name] ?? base;

        if (body.action === "remove") {
          if (base) {
            return json(
              { error: "Produktów z cennika bazowego nie można usunąć." },
              400,
            );
          }
          if (!catalog.overrides[name])
            return json({ error: "Nie znaleziono produktu." }, 404);
          delete catalog.overrides[name];
          catalog.log = appendLog(catalog.log, `Usunięto: ${name}`);
        } else {
          const price = Number(body.price);
          if (!Number.isFinite(price) || price < 0)
            return json({ error: "Podaj poprawną cenę." }, 400);
          const category = CATEGORIES.includes(body.category as Category)
            ? (body.category as Category)
            : (current?.category ?? "Loot");
          const rounded = Math.round(price);

          if (current && current.price === rounded && current.category === category) {
            return json({ ok: true, catalog });
          }

          catalog.overrides[name] = { category, price: rounded };
          catalog.log = appendLog(
            catalog.log,
            current
              ? `Zmiana ceny: ${name} — ${nf.format(rounded)}`
              : `Dodano: ${name} — ${nf.format(rounded)} (${category})`,
          );
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { error } = await supabaseAdmin.from("app_settings").upsert(
          {
            key: "catalog",
            value: catalog,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" },
        );
        if (error) return json({ error: "Zapis nie powiódł się." }, 500);

        return json({ ok: true, catalog });
      },
    },
  },
});
