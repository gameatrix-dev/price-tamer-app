import { createFileRoute } from "@tanstack/react-router";

import { ITEMS } from "@/data/items";

// Publiczny feed aktualizacji dla aplikacji desktopowej (Electron).
// Podbij `version` i `downloadUrl` przy każdym nowym wydaniu EXE.
const RELEASE = {
  version: "1.2.5",
  notes:
    "Nowe pozycje: głowa osła, krew Brennera, witaminy (pudełko/blister), kości 20 szt., węgiel aktywny, liść aloesu. Opaska uciskowa 500. Wstrzymano skup poćwiartowanego mięsa (wilk/jeleń/dzik oraz niedźwiedź).",
  downloadUrl:
    "https://price-tamer-app.lovable.app/__l5e/assets-v1/486a3ca4-d09e-4bff-9f7b-7f19a7d65738/SkupMachety-windows-x64.zip",
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
