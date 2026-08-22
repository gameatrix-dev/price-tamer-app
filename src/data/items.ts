export type Category =
  | "Chemia"
  | "Elektronika"
  | "Loot"
  | "Medyczne"
  | "Narzędzia"
  | "Obóz"
  | "Pojazdy";

export interface Item {
  name: string;
  category: Category;
  price: number;
}

export const CATEGORIES: Category[] = [
  "Chemia",
  "Elektronika",
  "Loot",
  "Medyczne",
  "Narzędzia",
  "Obóz",
  "Pojazdy",
];

export const ITEMS: Item[] = [
  { name: "Akumulator motocyklowy", category: "Pojazdy", price: 800 },
  { name: "Akumulator samochodowy", category: "Pojazdy", price: 1200 },
  { name: "Bandaż elastyczny", category: "Medyczne", price: 1000 },
  { name: "Baterie", category: "Elektronika", price: 200 },
  { name: "Baterie do smartfona", category: "Elektronika", price: 200 },
  { name: "Duże kanistry", category: "Pojazdy", price: 3000 },
  { name: "Filtr oleju", category: "Pojazdy", price: 500 },
  { name: "Flaki zwierzęce", category: "Loot", price: 100 },
  { name: "Głowa dzika 85%+", category: "Loot", price: 1500 },
  { name: "Głowa jelenia / łani 85%+", category: "Loot", price: 1000 },
  { name: "Głowa niedźwiedzia 85%+", category: "Loot", price: 2000 },
  { name: "Banjo / gitara", category: "Loot", price: 1500 },
  { name: "Dildo", category: "Loot", price: 1000 },
  { name: "Gumowy wąż", category: "Pojazdy", price: 200 },
  { name: "Igła", category: "Medyczne", price: 100 },
  { name: "Kable rozruchowe", category: "Pojazdy", price: 400 },
  { name: "Kamień szlifierski", category: "Narzędzia", price: 1200 },
  { name: "Karimata", category: "Obóz", price: 800 },
  { name: "Klej", category: "Narzędzia", price: 200 },
  { name: "Kuchenka elektryczna", category: "Obóz", price: 1000 },
  { name: "Kula medyczna", category: "Medyczne", price: 1000 },
  { name: "Lewarek", category: "Pojazdy", price: 500 },
  { name: "Łom", category: "Narzędzia", price: 1000 },
  { name: "Małe kanistry", category: "Pojazdy", price: 1500 },
  { name: "Koszula szpitalna", category: "Loot", price: 200 },
  { name: "Maseczka jednorazowa", category: "Medyczne", price: 100 },
  { name: "Nawóz przemysłowy", category: "Chemia", price: 1000 },
  { name: "Nożyce do drutu", category: "Narzędzia", price: 200 },
  { name: "Nożyczki", category: "Narzędzia", price: 100 },
  { name: "Oczy kukieł", category: "Loot", price: 700 },
  { name: "Olej hamulcowy", category: "Pojazdy", price: 300 },
  { name: "Opaska uciskowa", category: "Medyczne", price: 700 },
  { name: "Opatrunek hemostatyczny", category: "Medyczne", price: 700 },
  { name: "Opatrunek indywidualny", category: "Medyczne", price: 200 },
  { name: "Pakiet opatrunków", category: "Medyczne", price: 1000 },
  { name: "Alkohol izopropylowy", category: "Medyczne", price: 500 },
  { name: "Pamiętniki / papier (stack 20x)", category: "Loot", price: 1000 },
  { name: "Papier / pamiętnik (1 szt.)", category: "Loot", price: 50 },
  { name: "Piła łańcuchowa", category: "Narzędzia", price: 1000 },
  {
    name: "Poćwiartowane w kawałki mięso — wilk / jeleń / dzik (całość)",
    category: "Loot",
    price: 2000,
  },
  {
    name: "Poćwiartowane w kawałki mięso z niedźwiedzia (całość)",
    category: "Loot",
    price: 3500,
  },
  { name: "Przecinarki", category: "Narzędzia", price: 1000 },
  { name: "Ruszt do grilla", category: "Obóz", price: 1200 },
  { name: "Radio zielone", category: "Elektronika", price: 300 },
  { name: "Seksowne szorty", category: "Loot", price: 300 },
  { name: "Skalpel", category: "Narzędzia", price: 100 },
  { name: "Skóry", category: "Loot", price: 200 },
  { name: "Spodnie szpitalne", category: "Loot", price: 200 },
  { name: "Strzykawki", category: "Medyczne", price: 100 },
  { name: "Środki od chwastów", category: "Chemia", price: 400 },
  { name: "Taśma", category: "Narzędzia", price: 40 },
  { name: "Telefon", category: "Elektronika", price: 200 },
  { name: "Tłuszcz zwierzęcy", category: "Loot", price: 100 },
  { name: "Wiertarki", category: "Narzędzia", price: 1000 },
  { name: "Wykrywacz metali", category: "Elektronika", price: 1500 },
  { name: "Wsuwki (stack 20x)", category: "Loot", price: 200 },
  { name: "Zamek", category: "Narzędzia", price: 700 },
  { name: "Żel na oparzenia", category: "Medyczne", price: 1500 },
  { name: "Kilof", category: "Narzędzia", price: 1000 },
  { name: "Lodówka", category: "Obóz", price: 7000 },
  { name: "Zapałki", category: "Obóz", price: 200 },
  { name: "Metalowa rura", category: "Narzędzia", price: 200 },
  { name: "Gumka recepturka", category: "Loot", price: 50 },
  { name: "Zielone tajemnicze nasionka (x10)", category: "Loot", price: 15000 },
  { name: "Łzy feniksa", category: "Loot", price: 12000 },
  { name: "Karaś — ryba (x5)", category: "Loot", price: 1000 },
  { name: "Szczupak — ryba (x5)", category: "Loot", price: 1000 },
  { name: "Sardynki — ryba (x5)", category: "Loot", price: 1000 },
  { name: "Agregat prądotwórczy mały", category: "Obóz", price: 3000 },
  { name: "Agregat prądotwórczy duży", category: "Obóz", price: 25000 },
];
