import { useCallback, useEffect, useState } from "react";

import { ITEMS } from "@/data/items";

const STORAGE_KEY = "skup-machety:locked-items";

/** Domyślne blokady z cennika (items.ts → locked: true). */
const defaultLocked = () =>
  Object.fromEntries(
    ITEMS.map((i) => [i.name, Boolean(i.locked)]),
  ) as Record<string, boolean>;

/**
 * Blokady ilości sterowane z UI (ekran ustawień).
 * Nadpisania trzymane są w localStorage, więc przeżywają restart aplikacji.
 */
export function useItemLocks() {
  const [locks, setLocks] = useState<Record<string, boolean>>(defaultLocked);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, boolean>;
        setLocks({ ...defaultLocked(), ...saved });
      }
    } catch {
      /* uszkodzony wpis — zostajemy przy domyślnych */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Record<string, boolean>) => {
    setLocks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* brak dostępu do storage — działa tylko w tej sesji */
    }
  }, []);

  const toggleLock = useCallback(
    (name: string) => persist({ ...locks, [name]: !locks[name] }),
    [locks, persist],
  );

  const setLock = useCallback(
    (name: string, value: boolean) => persist({ ...locks, [name]: value }),
    [locks, persist],
  );

  const resetLocks = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setLocks(defaultLocked());
  }, []);

  const isLocked = useCallback(
    (name: string) => Boolean(locks[name]),
    [locks],
  );

  return { locks, isLocked, toggleLock, setLock, resetLocks, hydrated };
}
