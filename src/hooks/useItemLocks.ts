import { useCallback, useEffect, useState } from "react";

import { ITEMS } from "@/data/items";

const STORAGE_KEY = "skup-machety:locked-items";

/** W aplikacji desktopowej (file://) potrzebny jest pełny adres serwera. */
const API_BASE =
  typeof window !== "undefined" && window.location.protocol === "file:"
    ? "https://price-tamer-app.lovable.app"
    : "";

const API_URL = `${API_BASE}/api/public/item-locks`;

/** Domyślne blokady z cennika (items.ts → locked: true). */
const defaultLocked = () =>
  Object.fromEntries(ITEMS.map((i) => [i.name, Boolean(i.locked)])) as Record<
    string,
    boolean
  >;

/**
 * Blokady ilości wspólne dla wszystkich użytkowników.
 * Źródłem prawdy jest serwer; lokalna kopia służy jako cache offline.
 */
export function useItemLocks() {
  const [locks, setLocks] = useState<Record<string, boolean>>(defaultLocked);
  const [syncing, setSyncing] = useState(true);

  const applyRemote = useCallback((remote: Record<string, boolean>) => {
    const next = { ...defaultLocked(), ...remote };
    setLocks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* brak storage — działa tylko w tej sesji */
    }
  }, []);

  useEffect(() => {
    // Najpierw cache (natychmiastowy render), potem świeże dane z serwera.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw)
        setLocks({
          ...defaultLocked(),
          ...(JSON.parse(raw) as Record<string, boolean>),
        });
    } catch {
      /* uszkodzony cache — zostajemy przy domyślnych */
    }

    let cancelled = false;
    fetch(API_URL)
      .then((r) => r.json())
      .then((d: { locks?: Record<string, boolean> }) => {
        if (!cancelled && d.locks) applyRemote(d.locks);
      })
      .catch(() => {
        /* offline — zostaje cache */
      })
      .finally(() => {
        if (!cancelled) setSyncing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [applyRemote]);

  const isLocked = useCallback((name: string) => Boolean(locks[name]), [locks]);

  /** Zapis blokad na serwerze — wymaga poprawnego kodu PIN. */
  const saveLocks = useCallback(
    async (pin: string, updates: { name: string; locked: boolean }[]) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin, updates }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        locks?: Record<string, boolean>;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        return { ok: false as const, error: data.error ?? "Zapis nie powiódł się." };
      }
      if (data.locks) applyRemote(data.locks);
      return { ok: true as const };
    },
    [applyRemote],
  );

  /** Weryfikacja PIN-u bez zmiany danych. */
  const verifyPin = useCallback(async (pin: string) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pin, verifyOnly: true }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };
    return res.ok && data.ok
      ? { ok: true as const }
      : { ok: false as const, error: data.error ?? "Nieprawidłowy PIN." };
  }, []);

  return { locks, isLocked, saveLocks, verifyPin, syncing };
}
