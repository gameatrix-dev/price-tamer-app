import { useEffect, useMemo, useState } from "react";
import {
  KeyRound,
  Loader2,
  Lock,
  Megaphone,
  Plus,
  Search,
  Tags,
  Trash2,
  Unlock,
  X,
} from "lucide-react";

import { CATEGORIES, ITEMS, type Category, type Item } from "@/data/items";
import type { Announcement } from "@/hooks/useAnnouncement";

const nf = new Intl.NumberFormat("pl-PL");

interface Props {
  items: Item[];
  saveItem: (
    pin: string,
    item: { name: string; category: Category; price: number },
  ) => Promise<{ ok: boolean; error?: string }>;
  removeItem: (
    pin: string,
    name: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  locks: Record<string, boolean>;
  saveLocks: (
    pin: string,
    updates: { name: string; locked: boolean }[],
  ) => Promise<{ ok: boolean; error?: string }>;
  verifyPin: (pin: string) => Promise<{ ok: boolean; error?: string }>;
  announcement: Announcement;
  saveAnnouncement: (
    pin: string,
    next: Announcement,
  ) => Promise<{ ok: boolean; error?: string }>;
  onClose: () => void;
}

export default function LockSettings({
  items,
  saveItem,
  removeItem,
  locks,
  saveLocks,
  verifyPin,
  announcement,
  saveAnnouncement,
  onClose,
}: Props) {
  const [pin, setPin] = useState("");
  const [unlockedUi, setUnlockedUi] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Wszystkie">("Wszystkie");

  const [draft, setDraft] = useState<Announcement>(announcement);
  const [savingMsg, setSavingMsg] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => setDraft(announcement), [announcement]);

  const submitAnnouncement = async () => {
    setSavingMsg(true);
    setSavedMsg(false);
    setError("");
    const res = await saveAnnouncement(pin, draft);
    setSavingMsg(false);
    if (res.ok) setSavedMsg(true);
    else setError(res.error ?? "Zapis nie powiódł się.");
  };


  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter(
        (i) =>
          (category === "Wszystkie" || i.category === category) &&
          (q === "" || i.name.toLowerCase().includes(q)),
      )
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }, [items, query, category]);

  const lockedCount = items.filter((i) => locks[i.name]).length;

  // ——— Edytor produktów ———
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Loot");
  const [newPrice, setNewPrice] = useState("");
  const [savingNew, setSavingNew] = useState(false);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});

  const isCustom = (name: string) => !ITEMS.some((i) => i.name === name);

  const addProduct = async () => {
    const price = Number(newPrice);
    if (!newName.trim() || !Number.isFinite(price) || price < 0) {
      setError("Podaj nazwę i poprawną cenę.");
      return;
    }
    setSavingNew(true);
    setError("");
    const res = await saveItem(pin, {
      name: newName.trim(),
      category: newCategory,
      price,
    });
    setSavingNew(false);
    if (res.ok) {
      setNewName("");
      setNewPrice("");
    } else setError(res.error ?? "Zapis nie powiódł się.");
  };

  const savePrice = async (item: Item) => {
    const raw = priceDrafts[item.name];
    const price = Number(raw);
    if (raw === undefined || !Number.isFinite(price) || price < 0) {
      setError("Podaj poprawną cenę.");
      return;
    }
    setBusy(item.name);
    setError("");
    const res = await saveItem(pin, {
      name: item.name,
      category: item.category,
      price,
    });
    setBusy(null);
    if (res.ok)
      setPriceDrafts((prev) => {
        const next = { ...prev };
        delete next[item.name];
        return next;
      });
    else setError(res.error ?? "Zapis nie powiódł się.");
  };

  const deleteProduct = async (name: string) => {
    setBusy(name);
    setError("");
    const res = await removeItem(pin, name);
    setBusy(null);
    if (!res.ok) setError(res.error ?? "Nie udało się usunąć.");
  };

  const submitPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError("");
    const res = await verifyPin(pin);
    setChecking(false);
    if (res.ok) setUnlockedUi(true);
    else setError(res.error ?? "Nieprawidłowy PIN.");
  };

  const apply = async (updates: { name: string; locked: boolean }[]) => {
    setBusy(updates.length === 1 ? updates[0]!.name : "all");
    setError("");
    const res = await saveLocks(pin, updates);
    setBusy(null);
    if (!res.ok) setError(res.error ?? "Zapis nie powiódł się.");
  };

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
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij ustawienia"
            className="flex items-center gap-2 rounded border border-border px-3 py-2 text-xs uppercase tech text-foreground hover:bg-accent/30"
          >
            <X className="size-3.5" /> Zamknij
          </button>
        </div>

        {!unlockedUi ? (
          <form onSubmit={submitPin} className="space-y-4 px-5 py-8">
            <div className="flex items-center gap-2 text-primary">
              <KeyRound className="size-5" />
              <h3 className="text-sm font-semibold uppercase tech">
                Dostęp tylko dla administratora
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Podaj kod PIN, aby zarządzać blokadami produktów. Kod jest
              sprawdzany na serwerze — nie ma go w aplikacji.
            </p>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Kod PIN"
              aria-label="Kod PIN administratora"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm tech outline-none focus:border-primary"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={checking || pin.length === 0}
              className="flex items-center gap-2 rounded border border-primary px-4 py-2 text-xs uppercase tech text-primary disabled:opacity-50"
            >
              {checking && <Loader2 className="size-3.5 animate-spin" />}
              Odblokuj ustawienia
            </button>
          </form>
        ) : (
          <>
            <div className="space-y-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2 text-primary">
                <Megaphone className="size-4" />
                <h3 className="text-sm font-semibold uppercase tech">
                  Komunikat o pracy skupu
                </h3>
              </div>
              <label className="flex items-center gap-2 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={draft.enabled}
                  onChange={(e) =>
                    setDraft({ ...draft, enabled: e.target.checked })
                  }
                  className="size-4 accent-current"
                />
                Pokazuj komunikat wszystkim użytkownikom (okno pop-up + pasek)
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["open", "Skup czynny"],
                    ["closed", "Skup nieczynny"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDraft({ ...draft, status: value })}
                    className={`rounded border px-3 py-1.5 text-[10px] uppercase tech ${
                      draft.status === value
                        ? value === "open"
                          ? "border-primary text-primary"
                          : "border-destructive text-destructive"
                        : "border-border text-muted-foreground hover:bg-accent/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <textarea
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                rows={3}
                maxLength={500}
                placeholder="Treść komunikatu, np. Skup czynny tylko w dni parzyste, 18:00–22:00"
                aria-label="Treść komunikatu"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={submitAnnouncement}
                  disabled={savingMsg}
                  className="flex items-center gap-2 rounded border border-primary px-4 py-2 text-xs uppercase tech text-primary disabled:opacity-50"
                >
                  {savingMsg && <Loader2 className="size-3.5 animate-spin" />}
                  Zapisz komunikat
                </button>
                {savedMsg && (
                  <span className="text-[10px] uppercase tech text-primary">
                    Zapisano
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 border-b border-border px-5 py-4">

              <p className="text-xs text-muted-foreground">
                Wyłącz produkt, aby zablokować wpisywanie ilości w cenniku.
                Zmiany są wspólne — zobaczą je wszyscy użytkownicy aplikacji.
              </p>
              {error && <p className="text-xs text-destructive">{error}</p>}
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
                  disabled={busy !== null}
                  onClick={() =>
                    apply(rows.map((i) => ({ name: i.name, locked: true })))
                  }
                  className="rounded border border-border px-3 py-1.5 text-[10px] uppercase tech text-muted-foreground hover:bg-accent/30 disabled:opacity-50"
                >
                  Zablokuj widoczne
                </button>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() =>
                    apply(rows.map((i) => ({ name: i.name, locked: false })))
                  }
                  className="rounded border border-border px-3 py-1.5 text-[10px] uppercase tech text-muted-foreground hover:bg-accent/30 disabled:opacity-50"
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
                      disabled={busy !== null}
                      onClick={() =>
                        apply([{ name: item.name, locked: !locked }])
                      }
                      aria-pressed={locked}
                      className={`flex shrink-0 items-center gap-2 rounded border px-3 py-1.5 text-[10px] uppercase tech disabled:opacity-50 ${
                        locked
                          ? "border-destructive text-destructive"
                          : "border-primary text-primary"
                      }`}
                    >
                      {busy === item.name ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : locked ? (
                        <Lock className="size-3.5" />
                      ) : (
                        <Unlock className="size-3.5" />
                      )}
                      {locked ? "Zablokowany" : "Aktywny"}
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
          </>
        )}
      </div>
    </div>
  );
}
