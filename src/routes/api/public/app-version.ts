import { createFileRoute } from "@tanstack/react-router";

import { ITEMS } from "@/data/items";

// Publiczny feed aktualizacji dla aplikacji desktopowej (Electron).
// Podbij `version` i `downloadUrl` przy każdym nowym wydaniu EXE.
const RELEASE = {
  version: "1.2.0",
  notes: "Nowe produkty (ruszt do grilla, koszula i spodnie szpitalne), zaktualizowane ceny papieru i kamienia szlifierskiego, mapa lokalizacji skupu oraz eksport wyceny do PDF.",
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
