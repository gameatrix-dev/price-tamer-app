export interface ChangeEntry {
  date: string;
  version: string;
  changes: string[];
}

// Najnowsze wpisy na górze — dopisuj tutaj przy każdej zmianie cennika.
export const CHANGELOG: ChangeEntry[] = [
  {
    date: "2026-08-16",
    version: "1.1.2",
    changes: [
      "Dodano: Akumulator samochodowy — 1200 (Pojazdy)",
      "Dodano: Akumulator motocyklowy — 800 (Pojazdy)",
      "Zmiana ceny: Bandaż elastyczny — 1000",
      "Flaki zwierzęce — 100 (bez zmian)",
      "Naprawiono zapis wyceny jako obraz PNG",
    ],
  },
  {
    date: "2026-08-15",
    version: "1.1.1",
    changes: ["Zmiana ceny: Bandaż elastyczny — 900"],
  },
  {
    date: "2026-08-14",
    version: "1.1.0",
    changes: [
      "Zmiana ceny: Poćwiartowane mięso — wilk / jeleń / dzik — 2000",
      "Zmiana ceny: Poćwiartowane mięso z niedźwiedzia — 3500",
      "Dodano autoaktualizację aplikacji desktopowej",
    ],
  },
  {
    date: "2026-08-13",
    version: "1.0.1",
    changes: ["Dodano: Wykrywacz metali — 1500 (Elektronika)"],
  },
];
