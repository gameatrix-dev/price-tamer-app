import { useCallback, useEffect, useMemo, useState } from "react";

import { ITEMS, type Category, type Item } from "@/data/items";

export type CatalogOverride = { category: Category; price: number };
export type CatalogLogEntry = { date: string; changes: string[] };
export type Catalog = {
  overrides: Record<string, CatalogOverride>;
  log: CatalogLogEntry[];
};

const STORAGE_KEY = "skup-machety:catalog";

/** W aplikacji desktopowej (file://) potrzebny jest pełny adres serwera. */
const API_BASE =
  typeof window !== "undefined" && window.location.protocol === "file:"
    ? "https://price-tamer-app.lovable.app"
    : "";

const API_URL = `${API_BASE}/api/public/catalog`;

const EMPTY: Catalog = { overrides: {}, log: [] };

/** Cennik = baza z kodu + zmiany zapisane w ustawieniach (wspólne dla wszystkich). */
export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog>(EMPTY);

  const apply = useCallback((next: Catalog) => {
    setCatalog(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* brak storage */
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCatalog({ ...EMPTY, ...(JSON.parse(raw) as Catalog) });
    } catch {
      /* uszkodzony cache */
    }

    let cancelled = false;
    fetch(API_URL)
      .then((r) => r.json())
      .then((d: { catalog?: Catalog }) => {
        if (!cancelled && d.catalog) apply(d.catalog);
      })
      .catch(() => {
        /* offline — zostaje cache */
      });

    return () => {
      cancelled = true;
    };
  }, [apply]);

  const items = useMemo<Item[]>(() => {
    const merged = ITEMS.map((i) => {
      const o = catalog.overrides[i.name];
      return o ? { ...i, category: o.category, price: o.price } : i;
    });
    const extra = Object.entries(catalog.overrides)
      .filter(([name]) => !ITEMS.some((i) => i.name === name))
      .map(([name, o]) => ({ name, category: o.category, price: o.price }));
    return [...merged, ...extra];
  }, [catalog]);

  /** Dodanie produktu lub zmiana ceny — wymaga PIN-u. Changelog powstaje automatycznie. */
  const saveItem = useCallback(
    async (
      pin: string,
      item: { name: string; category: Category; price: number },
    ) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin, action: "upsert", ...item }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        catalog?: Catalog;
        error?: string;
      };
      if (!res.ok || !data.ok)
        return { ok: false as const, error: data.error ?? "Zapis nie powiódł się." };
      if (data.catalog) apply(data.catalog);
      return { ok: true as const };
    },
    [apply],
  );

  /** Usunięcie produktu dodanego ręcznie. */
  const removeItem = useCallback(
    async (pin: string, name: string) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin, action: "remove", name }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        catalog?: Catalog;
        error?: string;
      };
      if (!res.ok || !data.ok)
        return { ok: false as const, error: data.error ?? "Nie udało się usunąć." };
      if (data.catalog) apply(data.catalog);
      return { ok: true as const };
    },
    [apply],
  );

  return { items, catalogLog: catalog.log, saveItem, removeItem };
}
