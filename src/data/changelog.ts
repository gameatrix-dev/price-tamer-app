export interface ChangeEntry {
  date: string;
  version: string;
  changes: string[];
}

// Najnowsze wpisy na górze — dopisuj tutaj przy każdej zmianie cennika.
export const CHANGELOG: ChangeEntry[] = [
  {
    date: "2026-08-24",
    version: "1.2.4",
    changes: [
      "Dodano: Głowa wilka 85%+ — 1500 (Loot)",
      "Dodano: Głowa kozy 85%+ — 1500 (Loot)",
      "Dodano: Głowa konia 85%+ — 1500 (Loot)",
      "Dodano: Oskubany kurczak — 1500 (Loot)",
      "Dodano: Głowy zmutowanych zwierząt — 2000 (Loot)",
      "Dodano: Mięso zmutowanych zwierząt 85%+ — 2000 (Loot)",
      "Dodano: Skóry zmutowanych zwierząt 90%+ — 200 (Loot)",
      "Dodano: Flaki zmutowanych zwierząt — 100 (Loot)",
      "Dodano: Klucz hydrauliczny — 200 (Narzędzia)",
      "Dodano: Antybiotyki (blister) — 500 (Medyczne)",
      "Dodano: Środki przeciwbólowe (blister) — 500 (Medyczne)",
      "Dodano: Jodek potasu (blister) — 300 (Medyczne)",
      "Dodano: Alternator Szajbusa — 3000 (Pojazdy)",
      "Dodano: Alternator WW — 2500 (Pojazdy)",
      "Dodano: Alternator Łajki — 2500 (Pojazdy)",
      "Dodano: Zielone tajemnicze nasionka (1 szt.) — 1000 (Loot)",
      "Zmiana ceny: Opatrunek hemostatyczny — 500",
      "Zmiana ceny: Zielone tajemnicze nasionka (x10) — 10000",
    ],
  },
  {
    date: "2026-08-22",
    version: "1.2.3",
    changes: [
      "Dodano: Dildo — 1000 (Loot)",
      "Dodano: Głowa dzika 85%+ — 1500 (Loot)",
      "Dodano: Głowa jelenia / łani 85%+ — 1000 (Loot)",
      "Dodano: Głowa niedźwiedzia 85%+ — 2000 (Loot)",
      "Dodano: Banjo / gitara — 1500 (Loot)",
      "Usunięto: Głowy zwierząt 90%+",
      "Naprawiono białe tło po bokach strony",
    ],
  },
  {
    date: "2026-08-18",
    version: "1.2.2",
    changes: [
      "Dodano: Żel na oparzenia — 1500 (Medyczne)",
      "Dodano: Kilof — 1000 (Narzędzia)",
      "Dodano: Metalowa rura — 200 (Narzędzia)",
      "Dodano: Lodówka — 7000 (Obóz)",
      "Dodano: Zapałki — 200 (Obóz)",
      "Dodano: Agregat prądotwórczy mały — 3000 / duży — 25000 (Obóz)",
      "Dodano: Gumka recepturka — 50 (Loot)",
      "Dodano: Zielone tajemnicze nasionka (x10) — 15000 (Loot)",
      "Dodano: Łzy feniksa — 12000 (Loot)",
      "Dodano: Karaś / Szczupak / Sardynki (x5) — 1000 (Loot)",
      "Zmiana ceny: Oczy kukieł — 700",
      "Changelog jako osobna kolumna po lewej — cennik nie jest przesuwany w dół",
    ],
  },
  {
    date: "2026-08-17",
    version: "1.2.1",
    changes: [
      "Zmiana ceny: Duże kanistry — 3000",
      "Zmiana ceny: Małe kanistry — 1500",
      "Dodano: Opaska uciskowa — 700 (Medyczne)",
      "Dodano: Opatrunek indywidualny — 200 (Medyczne)",
      "Dodano: Pakiet opatrunków — 1000 (Medyczne)",
      "Dodano: Alkohol izopropylowy — 500 (Medyczne)",
    ],
  },
  {
    date: "2026-08-17",
    version: "1.2.0",
    changes: [
      "Zmiana ceny: Pamiętniki / papier (stack 20x) — 1000",
      "Zmiana ceny: Papier / pamiętnik (1 szt.) — 50",
      "Zmiana ceny: Kamień szlifierski — 1200",
      "Zmiana ceny: Maseczka jednorazowa — 100",
      "Dodano: Ruszt do grilla — 1200 (Obóz)",
      "Dodano: Koszula szpitalna — 200 (Loot)",
      "Dodano: Spodnie szpitalne — 200 (Loot)",
      "Dodano mapę lokalizacji skupu",
      "Dodano eksport wyceny do PDF",
    ],
  },
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
