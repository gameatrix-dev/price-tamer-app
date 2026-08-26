import { useMemo, useState } from "react";
import { Lock, RotateCcw, Search, Unlock, X } from "lucide-react";

import { CATEGORIES, ITEMS, type Category } from "@/data/items";

const nf = new Intl.NumberFormat("pl-PL");

interface Props {
  locks: Record<string, boolean>;
  toggleLock: (name: string) => void;
  setLock: (name: string, value: boolean) => void;
  resetLocks: () => void;
  onClose: () => void;
}

export default function LockSettings({
  locks,
  toggleLock,
  setLock,
  resetLocks,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Wszystkie">("Wszystkie");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter(
      (i) =>
        (category === "Wszystkie" || i.category === category) &&
        (q === "" || i.name.toLowerCase().includes(q)),
    ).sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }, [query, category]);

  const lockedCount = ITEMS.filter((i) => locks[i.name]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/95 p-4 backdrop-blur-sm">
      <div className="my-6 w-full max-w-3xl rounded border border-border bg-card">
        <div className="h-2 hazard-bar" />
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-primary">
              Ustawienia skupu
            </h2>
            <p className="text-[10px] uppercase tech text-muted-foreground">
              Zablokowane pozycje: {lockedCount} / {ITEMS.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetLocks}
              className="flex items-center gap-2 rounded border border-border px-3 py-2 text-xs uppercase tech text-muted-foreground hover:bg-accent/30"
            >
              <RotateCcw className="size-3.5" /> Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Zamknij ustawienia"
              className="flex items-center gap-2 rounded border border-border px-3 py-2 text-xs uppercase tech text-foreground hover:bg-accent/30"
            >
              <X className="size-3.5" /> Zamknij
            </button>
          </div>
        </div>

        <div className="space-y-3 border-b border-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Wyłącz produkt, aby zablokować wpisywanie ilości w cenniku (np. gdy
            spadło zapotrzebowanie). Ustawienia zapisują się lokalnie.
          </p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj produktu…"
              aria-label="Szukaj produktu w ustawieniach"
              className="w-full rounded border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Wszystkie", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded border px-2.5 py-1 text-[10px] uppercase tech ${
                  category === c
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground hover:bg-accent/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => rows.forEach((i) => setLock(i.name, true))}
              className="rounded border border-border px-3 py-1.5 text-[10px] uppercase tech text-muted-foreground hover:bg-accent/30"
            >
              Zablokuj widoczne
            </button>
            <button
              type="button"
              onClick={() => rows.forEach((i) => setLock(i.name, false))}
              className="rounded border border-border px-3 py-1.5 text-[10px] uppercase tech text-muted-foreground hover:bg-accent/30"
            >
              Odblokuj widoczne
            </button>
          </div>
        </div>

        <ul className="max-h-[55vh] overflow-y-auto">
          {rows.map((item) => {
            const locked = Boolean(locks[item.name]);
            return (
              <li
                key={item.name}
                className="flex items-center justify-between gap-3 border-b border-border px-5 py-2.5 last:border-0"
              >
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm ${locked ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {item.name}
                  </p>
                  <p className="text-[10px] uppercase tech text-muted-foreground">
                    {item.category} · {nf.format(item.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleLock(item.name)}
                  aria-pressed={locked}
                  className={`flex shrink-0 items-center gap-2 rounded border px-3 py-1.5 text-[10px] uppercase tech ${
                    locked
                      ? "border-destructive text-destructive"
                      : "border-primary text-primary"
                  }`}
                >
                  {locked ? (
                    <>
                      <Lock className="size-3.5" /> Zablokowany
                    </>
                  ) : (
                    <>
                      <Unlock className="size-3.5" /> Aktywny
                    </>
                  )}
                </button>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="px-5 py-8 text-center text-sm tech text-muted-foreground">
              Brak wyników.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
