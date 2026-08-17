import { createFileRoute } from "@tanstack/react-router";

import { ITEMS } from "@/data/items";

// Publiczny feed aktualizacji dla aplikacji desktopowej (Electron).
// Podbij `version` i `downloadUrl` przy każdym nowym wydaniu EXE.
const RELEASE = {
  version: "1.2.1",
  notes: "Nowe produkty medyczne (opaska uciskowa, opatrunek indywidualny, pakiet opatrunków, alkohol izopropylowy), zmiana cen kanistrów (duży 3000, mały 1500) oraz changelog przeniesiony na górę widoku.",
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
