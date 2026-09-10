import { createFileRoute } from "@tanstack/react-router";

import { ITEMS } from "@/data/items";

// Publiczny feed aktualizacji dla aplikacji desktopowej (Electron).
// Podbij `version` i `downloadUrl` przy każdym nowym wydaniu EXE.
const RELEASE = {
  version: "1.2.8",
  notes:
    "Dodawanie produktów i zmiana cen z poziomu ustawień (PIN) — zmiany zapisują się na serwerze i trafiają automatycznie do changelogu.",
  downloadUrl:
    "https://price-tamer-app.lovable.app/__l5e/assets-v1/73f33dba-2bec-4fcc-8935-ebe821fd06cb/SkupMachety-windows-x64.zip",
};

export const Route = createFileRoute("/api/public/app-version")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Wspólne blokady produktów — aplikacja desktopowa pobiera je razem z cennikiem.
        let locks: Record<string, boolean> = {};
        try {
          const res = await fetch(
            new URL("/api/public/item-locks", request.url),
          );
          if (res.ok)
            locks = ((await res.json()) as { locks?: Record<string, boolean> })
              .locks ?? {};
        } catch {
          /* brak blokad — aplikacja użyje własnego cache'u */
        }

        return new Response(
          JSON.stringify({ ...RELEASE, items: ITEMS, locks }),
          {
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*",
              "cache-control": "no-store",
            },
          },
        );
      },
    },
  },
});
