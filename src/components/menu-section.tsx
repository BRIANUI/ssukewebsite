import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProductDialog, type MenuItem } from "@/components/product-dialog";
import { formatKES } from "@/lib/cart";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

async function fetchMenu(): Promise<MenuItem[]> {
  const q = query(collection(db, "menu_items"), where("available", "==", true));
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, "id"> & { sort_order?: number }) }));
  items.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return items as MenuItem[];
}

export function MenuSection() {
  const { data, isLoading } = useQuery({ queryKey: ["menu", "public"], queryFn: fetchMenu });
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set((data ?? []).map((i) => i.category)))], [data]);
  const filtered = useMemo(
    () => (activeCategory === "All" ? data ?? [] : (data ?? []).filter((i) => i.category === activeCategory)),
    [data, activeCategory],
  );

  return (
    <section id="menu" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">The Menu</div>
          <h2 className="mt-2 font-display text-5xl tracking-wide sm:text-6xl">Fresh, hot, made to order.</h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">Tap any dish for full details, then add it straight to your cart. Prices in KES.</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === c
                ? "border-secondary bg-secondary text-secondary-foreground"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)
          : filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[image:var(--gradient-warm)]">
                      <span className="font-display text-7xl text-secondary/70">SP</span>
                    </div>
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    {item.category}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-xl tracking-wide leading-tight text-card-foreground">{item.name}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-2xl text-foreground">{formatKES(item.price)}</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-90">
                      <Plus className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
      </div>

      <ProductDialog item={selected} onOpenChange={(v) => !v && setSelected(null)} />
    </section>
  );
}