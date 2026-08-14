import { createFileRoute } from "@tanstack/react-router";

import SkupApp from "@/components/SkupApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SCUM Skup — Cennik przedmiotów i kalkulator" },
      {
        name: "description",
        content:
          "Cennik skupu SCUM: baza produktów z wyszukiwarką, sortowaniem alfabetycznym i kalkulatorem kosztu skupu dla dowolnej liczby sztuk.",
      },
      {
        property: "og:title",
        content: "SCUM Skup — Cennik przedmiotów i kalkulator",
      },
      {
        property: "og:description",
        content:
          "Baza cen skupu w SCUM z wyszukiwarką, sortowaniem i kalkulatorem łącznego kosztu.",
      },
    ],
  }),
  component: SkupApp,
});
