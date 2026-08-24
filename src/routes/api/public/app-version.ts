import { createFileRoute } from "@tanstack/react-router";

import { ITEMS } from "@/data/items";

// Publiczny feed aktualizacji dla aplikacji desktopowej (Electron).
// Podbij `version` i `downloadUrl` przy każdym nowym wydaniu EXE.
const RELEASE = {
  version: "1.2.4",
  notes:
    "16 nowych produktów (głowy wilka/kozy/konia 85%+, oskubany kurczak, zmutowane zwierzęta, klucz hydrauliczny, blistry medyczne, alternatory Szajbusa/WW/Łajki, nasionka 1 szt.), zmiana cen: opatrunek hemostatyczny 500, nasionka x10 — 10000.",
  downloadUrl:
    "https://price-tamer-app.lovable.app/__l5e/assets-v1/486a3ca4-d09e-4bff-9f7b-7f19a7d65738/SkupMachety-windows-x64.zip",
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
