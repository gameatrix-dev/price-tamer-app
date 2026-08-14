import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownAZ,
  Crosshair,
  ImageDown,
  Search,
  Trash2,
} from "lucide-react";

import { CATEGORIES, ITEMS, type Category } from "@/data/items";
import heroImg from "@/assets/scum-hero.jpg";
import catChemia from "@/assets/cat-chemia.jpg";
import catElektronika from "@/assets/cat-elektronika.jpg";
import catLoot from "@/assets/cat-loot.jpg";
import catMedyczne from "@/assets/cat-medyczne.jpg";
import catNarzedzia from "@/assets/cat-narzedzia.jpg";
import catOboz from "@/assets/cat-oboz.jpg";
import catPojazdy from "@/assets/cat-pojazdy.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SCUM Skup — Cennik przedmiotów i kalkulator" },
      {
        name: "description",
        content:
          "Cennik skupu SCUM: baza produktów z wyszukiwarką, sortowaniem alfabetycznym i kalkulatorem kosztu skupu dla dowolnej liczby sztuk.",
      },
      {
        property: "og:title",
        content: "SCUM Skup — Cennik przedmiotów i kalkulator",
      },
      {
        property: "og:description",
        content:
          "Baza cen skupu w SCUM z wyszukiwarką, sortowaniem i kalkulatorem łącznego kosztu.",
      },
    ],
  }),
  component: Index,
});

const CATEGORY_IMAGES: Record<Category, string> = {
  Chemia: catChemia,
  Elektronika: catElektronika,
  Loot: catLoot,
  Medyczne: catMedyczne,
  Narzędzia: catNarzedzia,
  Obóz: catOboz,
  Pojazdy: catPojazdy,
};

const nf = new Intl.NumberFormat("pl-PL");

function Index() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Wszystkie">("Wszystkie");
  const [asc, setAsc] = useState(true);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [stamp, setStamp] = useState("");
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStamp(new Date().toLocaleString("pl-PL"));
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter(
      (i) =>
        (category === "Wszystkie" || i.category === category) &&
        (q === "" || i.name.toLowerCase().includes(q)),
    ).sort((a, b) =>
      asc
        ? a.name.localeCompare(b.name, "pl")
        : b.name.localeCompare(a.name, "pl"),
    );
  }, [query, category, asc]);

  const selected = ITEMS.filter((i) => (qty[i.name] ?? 0) > 0).map((i) => {
    const n = qty[i.name] ?? 0;
    return { ...i, qty: n, sum: n * i.price };
  });

  const totalPieces = selected.reduce((s, i) => s + i.qty, 0);
  const totalCost = selected.reduce((s, i) => s + i.sum, 0);

  const setItemQty = (name: string, value: string) => {
    const n = Math.max(0, Math.min(99999, Math.floor(Number(value) || 0)));
    setQty((prev) => ({ ...prev, [name]: n }));
  };

  const saveImage = async () => {
    if (!captureRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#12181a",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `wycena-scum-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-3 w-full hazard-bar" />

      <header className="relative overflow-hidden border-b border-border">
        <img
          src={heroImg}
          alt="Mglisty posterunek w lesie — punkt skupu SCUM"
          width={1920}
          height={700}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto flex max-w-6xl items-end gap-4 px-4 pb-8 pt-28">
          <Crosshair className="mb-2 size-9 shrink-0 text-primary" />
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wide text-primary sm:text-6xl">
              SCUM · Punkt skupu
            </h1>
            <p className="mt-1 text-xs uppercase tech text-muted-foreground">
              Cennik operacyjny // {ITEMS.length} pozycji w bazie
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
        <section>
          <div className="rounded border border-border bg-card p-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Szukaj przedmiotu..."
                  aria-label="Szukaj przedmiotu"
                  className="w-full rounded border border-border bg-background py-2.5 pl-10 pr-3 text-sm tech outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
              <button
                onClick={() => setAsc((v) => !v)}
                className="inline-flex items-center gap-2 rounded border border-border bg-secondary px-4 text-xs uppercase tech text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowDownAZ className="size-4" />
                {asc ? "A → Z" : "Z → A"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(["Wszystkie", ...CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded border px-3 py-1.5 text-xs uppercase tech transition-colors ${
                    category === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded border border-border bg-card">
            <div className="grid grid-cols-[1fr_80px_110px_90px] gap-2 border-b border-border bg-secondary px-4 py-2 text-[10px] uppercase tech text-muted-foreground">
              <span>Przedmiot</span>
              <span className="text-right">Cena</span>
              <span className="text-center">Ilość</span>
              <span className="text-right">Suma</span>
            </div>

            {rows.map((item) => {
              const q = qty[item.name] ?? 0;
              return (
                <div
                  key={item.name}
                  className={`grid grid-cols-[1fr_80px_110px_90px] items-center gap-2 border-b border-border px-4 py-2.5 transition-colors last:border-0 ${
                    q > 0 ? "bg-accent/40" : "hover:bg-accent/20"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={CATEGORY_IMAGES[item.category]}
                      alt={item.category}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="size-10 shrink-0 rounded border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">
                        {item.name}
                      </p>
                      <p className="text-[10px] uppercase tech text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <span className="text-right text-sm tech text-primary">
                    {nf.format(item.price)}
                  </span>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    aria-label={`Ilość — ${item.name}`}
                    value={q === 0 ? "" : q}
                    placeholder="0"
                    onChange={(e) => setItemQty(item.name, e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-center text-sm tech outline-none focus:border-primary"
                  />
                  <span
                    className={`text-right text-sm tech ${q > 0 ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {nf.format(q * item.price)}
                  </span>
                </div>
              );
            })}

            {rows.length === 0 && (
              <p className="px-4 py-10 text-center text-sm tech text-muted-foreground">
                Brak wyników.
              </p>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded border border-border bg-card">
            <div className="h-2 hazard-bar" />
            <div className="p-5">
              <h2 className="text-xl font-semibold uppercase text-primary">
                Kalkulacja skupu
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Wpisz ilość sztuk przy przedmiotach, aby wyliczyć koszt skupu.
              </p>

              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between text-xs uppercase tech text-muted-foreground">
                  <span>Sztuk łącznie</span>
                  <span className="text-foreground">
                    {nf.format(totalPieces)}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xs uppercase tech text-muted-foreground">
                    Koszt skupu
                  </span>
                  <span className="text-3xl font-bold tech text-primary">
                    {nf.format(totalCost)}
                  </span>
                </div>
              </div>

              <button
                onClick={saveImage}
                disabled={selected.length === 0 || saving}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded border border-primary/60 bg-primary/15 px-4 py-2.5 text-xs uppercase tech text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ImageDown className="size-4" />
                {saving ? "Generuję..." : "Wycena jako obraz"}
              </button>
              <button
                onClick={() => setQty({})}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded border border-border bg-secondary px-4 py-2.5 text-xs uppercase tech text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-4" />
                Wyczyść
              </button>
            </div>
          </div>
          <p className="mt-3 px-1 text-[11px] text-muted-foreground">
            Ceny orientacyjne — dostosuj je w bazie do stawek swojego skupu.
          </p>
        </aside>
      </main>

      {/* Ukryty layout eksportowany do PNG */}
      <div className="pointer-events-none fixed -left-[9999px] top-0">
        <div
          ref={captureRef}
          style={{ width: 720 }}
          className="bg-background p-8"
        >
          <div className="h-2 w-full hazard-bar" />
          <h2 className="mt-5 text-2xl font-bold uppercase text-primary">
            SCUM · Wycena skupu
          </h2>
          <p className="text-[11px] uppercase tech text-muted-foreground">
            {stamp}
          </p>
          <table className="mt-5 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tech text-muted-foreground">
                <th className="py-2 text-left">Przedmiot</th>
                <th className="py-2 text-right">Cena</th>
                <th className="py-2 text-right">Ilość</th>
                <th className="py-2 text-right">Suma</th>
              </tr>
            </thead>
            <tbody>
              {selected.map((i) => (
                <tr key={i.name} className="border-b border-border">
                  <td className="py-1.5 pr-3 text-foreground">{i.name}</td>
                  <td className="py-1.5 text-right tech text-muted-foreground">
                    {nf.format(i.price)}
                  </td>
                  <td className="py-1.5 text-right tech text-foreground">
                    {nf.format(i.qty)}
                  </td>
                  <td className="py-1.5 text-right tech text-primary">
                    {nf.format(i.sum)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-end justify-between border-t border-primary/40 pt-3">
            <span className="text-xs uppercase tech text-muted-foreground">
              Sztuk: {nf.format(totalPieces)}
            </span>
            <span className="text-2xl font-bold tech text-primary">
              {nf.format(totalCost)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
