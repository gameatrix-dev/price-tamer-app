import { createFileRoute } from "@tanstack/react-router";

import { ITEMS } from "@/data/items";

// Publiczny feed aktualizacji dla aplikacji desktopowej (Electron).
// Podbij `version` i `downloadUrl` przy każdym nowym wydaniu EXE.
const RELEASE = {
  version: "1.1.0",
  notes: "Nowe ceny mięsa (wilk/jeleń/dzik 2000, niedźwiedź 3500).",
  downloadUrl: "https://price-tamer-app.lovable.app/downloads/SkupMachety-windows-x64.zip",
};

export const Route = createFileRoute("/api/public/app-version")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          JSON.stringify({ ...RELEASE, items: ITEMS }),
          {
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*",
              "cache-control": "no-store",
            },
          },
        ),
    },
  },
});
