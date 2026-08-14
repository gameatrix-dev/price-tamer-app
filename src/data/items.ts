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
  { name: "Bandaż elastyczny", category: "Medyczne", price: 1000 },
  { name: "Baterie", category: "Elektronika", price: 200 },
  { name: "Baterie do smartfona", category: "Elektronika", price: 200 },
  { name: "Duże kanistry", category: "Pojazdy", price: 1000 },
  { name: "Filtr oleju", category: "Pojazdy", price: 500 },
  { name: "Flaki zwierzęce", category: "Loot", price: 100 },
  { name: "Głowy zwierząt 90%+", category: "Loot", price: 1000 },
  { name: "Gumowy wąż", category: "Pojazdy", price: 200 },
  { name: "Igła", category: "Medyczne", price: 100 },
  { name: "Kable rozruchowe", category: "Pojazdy", price: 400 },
  { name: "Kamień szlifierski", category: "Narzędzia", price: 500 },
  { name: "Karimata", category: "Obóz", price: 800 },
  { name: "Klej", category: "Narzędzia", price: 200 },
  { name: "Kuchenka elektryczna", category: "Obóz", price: 1000 },
  { name: "Kula medyczna", category: "Medyczne", price: 1000 },
  { name: "Lewarek", category: "Pojazdy", price: 500 },
  { name: "Łom", category: "Narzędzia", price: 1000 },
  { name: "Małe kanistry", category: "Pojazdy", price: 500 },
  { name: "Maseczka jednorazowa", category: "Medyczne", price: 70 },
  { name: "Nawóz przemysłowy", category: "Chemia", price: 1000 },
  { name: "Nożyce do drutu", category: "Narzędzia", price: 200 },
  { name: "Nożyczki", category: "Narzędzia", price: 100 },
  { name: "Oczy kukieł", category: "Loot", price: 600 },
  { name: "Olej hamulcowy", category: "Pojazdy", price: 300 },
  { name: "Opatrunek hemostatyczny", category: "Medyczne", price: 700 },
  { name: "Pamiętniki / papier (stack 20x)", category: "Loot", price: 1600 },
  { name: "Papier / pamiętnik (1 szt.)", category: "Loot", price: 80 },
  { name: "Piła łańcuchowa", category: "Narzędzia", price: 1000 },
  {
    name: "Poćwiartowane w kawałki mięso — wilk / jeleń (całość)",
    category: "Loot",
    price: 1000,
  },
  {
    name: "Poćwiartowane w kawałki mięso z niedźwiedzia (całość)",
    category: "Loot",
    price: 2000,
  },
  { name: "Przecinarki", category: "Narzędzia", price: 1000 },
  { name: "Radio zielone", category: "Elektronika", price: 300 },
  { name: "Seksowne szorty", category: "Loot", price: 300 },
  { name: "Skalpel", category: "Narzędzia", price: 100 },
  { name: "Skóry", category: "Loot", price: 200 },
  { name: "Strzykawki", category: "Medyczne", price: 100 },
  { name: "Środki od chwastów", category: "Chemia", price: 400 },
  { name: "Taśma", category: "Narzędzia", price: 40 },
  { name: "Telefon", category: "Elektronika", price: 200 },
  { name: "Tłuszcz zwierzęcy", category: "Loot", price: 100 },
  { name: "Wiertarki", category: "Narzędzia", price: 1000 },
  { name: "Wsuwki (stack 20x)", category: "Loot", price: 200 },
  { name: "Zamek", category: "Narzędzia", price: 700 },
];
