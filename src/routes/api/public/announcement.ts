import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { createHash, timingSafeEqual } from "node:crypto";

export type Announcement = {
  enabled: boolean;
  status: "open" | "closed";
  text: string;
};

const DEFAULT_ANNOUNCEMENT: Announcement = {
  enabled: false,
  status: "open",
  text: "Skup czynny — zapraszamy!",
};

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

function normalize(value: unknown): Announcement {
  const v = (value ?? {}) as Partial<Announcement>;
  return {
    enabled: Boolean(v.enabled),
    status: v.status === "closed" ? "closed" : "open",
    text:
      typeof v.text === "string" && v.text.trim() !== ""
        ? v.text.slice(0, 500)
        : DEFAULT_ANNOUNCEMENT.text,
  };
}

async function readAnnouncement(): Promise<Announcement> {
  const { data, error } = await publicClient()
    .from("app_settings")
    .select("value")
    .eq("key", "announcement")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return normalize(data?.value);
}

export const Route = createFileRoute("/api/public/announcement")({
  server: {
    handlers: {
      OPTIONS: async () => json({ ok: true }),

      GET: async () => {
        try {
          return json({ announcement: await readAnnouncement() });
        } catch {
          return json({ announcement: DEFAULT_ANNOUNCEMENT });
        }
      },

      POST: async ({ request }) => {
        const expected = process.env["ADMIN_PIN"];
        if (!expected) return json({ error: "Brak konfiguracji PIN." }, 500);

        let body: { pin?: unknown; announcement?: unknown };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return json({ error: "Nieprawidłowe dane." }, 400);
        }

        const pin = typeof body.pin === "string" ? body.pin : "";
        if (!pin || !pinMatches(pin, expected)) {
          return json({ ok: false, error: "Nieprawidłowy PIN." }, 401);
        }

        const announcement = normalize(body.announcement);

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { error } = await supabaseAdmin.from("app_settings").upsert(
          {
            key: "announcement",
            value: announcement,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" },
        );
        if (error) return json({ error: "Zapis nie powiódł się." }, 500);

        return json({ ok: true, announcement });
      },
    },
  },
});
