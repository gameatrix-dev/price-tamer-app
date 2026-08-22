import { createFileRoute } from "@tanstack/react-router";

import { ITEMS } from "@/data/items";

// Publiczny feed aktualizacji dla aplikacji desktopowej (Electron).
// Podbij `version` i `downloadUrl` przy każdym nowym wydaniu EXE.
const RELEASE = {
  version: "1.2.3",
  notes:
    "Nowe produkty (dildo, głowy dzika/jelenia/łani/niedźwiedzia 85%+, banjo/gitara), usunięto „Głowy zwierząt 90%+”, naprawiono białe tło po bokach. Zawiera też całą zawartość v1.2.2.",
  downloadUrl:
    "https://price-tamer-app.lovable.app/__l5e/assets-v1/31bb9829-cb24-4b2a-be7b-18ab0327daf2/SkupMachety-windows-x64.zip",
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
