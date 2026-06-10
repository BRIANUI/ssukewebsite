import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, formatKES, type CartItem } from "@/lib/cart";
import { toast } from "sonner";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
}

export function ProductDialog({ item, onOpenChange }: { item: MenuItem | null; onOpenChange: (v: boolean) => void }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  useEffect(() => { if (item) setQty(1); }, [item]);

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        {item && (
          <div>
            <div className="relative aspect-[16/10] w-full bg-secondary">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[image:var(--gradient-warm)]">
                  <span className="font-display text-6xl text-secondary/80">SP</span>
                </div>
              )}
              <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider">{item.category}</div>
            </div>
            <div className="p-6">
              <DialogTitle className="font-display text-3xl tracking-wide">{item.name}</DialogTitle>
              <DialogDescription className="mt-2 text-base text-muted-foreground">
                {item.description}
              </DialogDescription>
              <div className="mt-5 flex items-end justify-between">
                <div className="font-display text-3xl text-foreground">{formatKES(item.price)}</div>
                <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center font-bold tabular-nums">{qty}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQty((q) => q + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                className="mt-5 w-full h-12 text-base font-bold"
                onClick={() => {
                  const ci: Omit<CartItem, "quantity"> = { id: item.id, name: item.name, price: item.price, image_url: item.image_url };
                  add(ci, qty);
                  toast.success(`${item.name} added to cart`);
                  onOpenChange(false);
                }}
              >
                Add {qty} to cart — {formatKES(item.price * qty)}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}