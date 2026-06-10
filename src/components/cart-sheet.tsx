import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatKES, useCart } from "@/lib/cart";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { CheckoutDialog } from "@/components/checkout-dialog";

export function CartSheet() {
  const { items, isOpen, setOpen, setQuantity, remove, subtotal } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  return (
    <>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="font-display text-2xl tracking-wide">Your Order</SheetTitle>
            <SheetDescription>Review before checkout</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <ShoppingBag className="h-12 w-12 opacity-30" />
                <p>Your cart is empty.</p>
                <Button variant="outline" onClick={() => setOpen(false)}>Browse menu</Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((i) => (
                  <li key={i.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {i.image_url ? <img src={i.image_url} alt={i.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[image:var(--gradient-warm)]" />}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold leading-tight">{i.name}</span>
                        <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatKES(i.price)}</span>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-border p-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setQuantity(i.id, i.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                          <span className="w-6 text-center text-sm font-bold tabular-nums">{i.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setQuantity(i.id, i.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                        <span className="font-display text-lg">{formatKES(i.price * i.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {items.length > 0 && (
            <div className="border-t border-border bg-muted/40 px-6 py-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl">{formatKES(subtotal)}</span>
              </div>
              <Button className="h-12 w-full font-bold" onClick={() => setCheckoutOpen(true)}>Checkout — {formatKES(subtotal)}</Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">Delivery fee calculated at checkout.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}