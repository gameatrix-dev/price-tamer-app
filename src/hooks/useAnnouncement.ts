import { useCallback, useEffect, useState } from "react";

export type Announcement = {
  enabled: boolean;
  status: "open" | "closed";
  text: string;
};

const STORAGE_KEY = "skup-machety:announcement";

/** W aplikacji desktopowej (file://) potrzebny jest pełny adres serwera. */
const API_BASE =
  typeof window !== "undefined" && window.location.protocol === "file:"
    ? "https://price-tamer-app.lovable.app"
    : "";

const API_URL = `${API_BASE}/api/public/announcement`;

const DEFAULT: Announcement = {
  enabled: false,
  status: "open",
  text: "Skup czynny — zapraszamy!",
};

/** Komunikat o godzinach/dniach pracy skupu — wspólny dla wszystkich. */
export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement>(DEFAULT);

  const apply = useCallback((next: Announcement) => {
    setAnnouncement(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* brak storage */
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAnnouncement({ ...DEFAULT, ...(JSON.parse(raw) as Announcement) });
    } catch {
      /* uszkodzony cache */
    }

    let cancelled = false;
    fetch(API_URL)
      .then((r) => r.json())
      .then((d: { announcement?: Announcement }) => {
        if (!cancelled && d.announcement) apply(d.announcement);
      })
      .catch(() => {
        /* offline — zostaje cache */
      });

    return () => {
      cancelled = true;
    };
  }, [apply]);

  const saveAnnouncement = useCallback(
    async (pin: string, next: Announcement) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin, announcement: next }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        announcement?: Announcement;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        return {
          ok: false as const,
          error: data.error ?? "Zapis nie powiódł się.",
        };
      }
      if (data.announcement) apply(data.announcement);
      return { ok: true as const };
    },
    [apply],
  );

  return { announcement, saveAnnouncement };
}
