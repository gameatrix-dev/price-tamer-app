import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { createHash, timingSafeEqual } from "node:crypto";

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

/** Porównanie odporne na atak czasowy (obie strony hashowane do równej długości). */
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

async function readLocks() {
  const { data, error } = await publicClient()
    .from("item_locks")
    .select("item_name, locked");
  if (error) throw new Error(error.message);
  return Object.fromEntries(
    (data ?? []).map((r) => [r.item_name as string, Boolean(r.locked)]),
  ) as Record<string, boolean>;
}

export const Route = createFileRoute("/api/public/item-locks")({
  server: {
    handlers: {
      OPTIONS: async () => json({ ok: true }),

      GET: async () => {
        try {
          return json({ locks: await readLocks() });
        } catch {
          return json({ error: "Nie udało się pobrać blokad." }, 500);
        }
      },

      POST: async ({ request }) => {
        const expected = process.env["ADMIN_PIN"];
        if (!expected) return json({ error: "Brak konfiguracji PIN." }, 500);

        let body: {
          pin?: unknown;
          updates?: unknown;
          verifyOnly?: unknown;
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

        if (body.verifyOnly === true) return json({ ok: true });

        const updates = Array.isArray(body.updates) ? body.updates : [];
        const rows = updates
          .filter(
            (u): u is { name: string; locked: boolean } =>
              !!u &&
              typeof (u as { name?: unknown }).name === "string" &&
              typeof (u as { locked?: unknown }).locked === "boolean",
          )
          .slice(0, 500)
          .map((u) => ({
            item_name: u.name,
            locked: u.locked,
            updated_at: new Date().toISOString(),
          }));

        if (rows.length === 0) return json({ ok: true, locks: await readLocks() });

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { error } = await supabaseAdmin
          .from("item_locks")
          .upsert(rows, { onConflict: "item_name" });
        if (error) return json({ error: "Zapis nie powiódł się." }, 500);

        return json({ ok: true, locks: await readLocks() });
      },
    },
  },
});
