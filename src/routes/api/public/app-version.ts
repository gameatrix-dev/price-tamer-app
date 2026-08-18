import { createFileRoute } from "@tanstack/react-router";

import { ITEMS } from "@/data/items";

// Publiczny feed aktualizacji dla aplikacji desktopowej (Electron).
// Podbij `version` i `downloadUrl` przy każdym nowym wydaniu EXE.
const RELEASE = {
  version: "1.2.2",
  notes:
    "Nowe produkty (żel na oparzenia, kilof, lodówka, zapałki, metalowa rura, gumka recepturka, nasionka, łzy feniksa, ryby, agregaty), oczy kukieł 700, changelog w osobnej kolumnie po lewej.",
  downloadUrl:
    "https://price-tamer-app.lovable.app/__l5e/assets-v1/767c752a-af8b-44d9-8f01-d074ccffc54d/SkupMachety-windows-x64.zip",
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
