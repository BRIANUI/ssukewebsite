import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatKES, useCart } from "@/lib/cart";
import { useState } from "react";
import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

const DELIVERY_FEE = 150;
const schema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  customer_phone: z.string().trim().min(7).max(20),
  customer_email: z.string().trim().email().max(200).optional().or(z.literal("")),
  delivery_address: z.string().trim().min(5).max(300),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export function CheckoutDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { items, subtotal, clear, setOpen } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Check your details");
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const ref = await addDoc(collection(db, "orders"), {
        customer_name: parsed.data.customer_name,
        customer_phone: parsed.data.customer_phone,
        customer_email: parsed.data.customer_email || null,
        delivery_address: parsed.data.delivery_address,
        notes: parsed.data.notes || null,
        subtotal, delivery_fee: DELIVERY_FEE, total,
        status: "pending",
        items: items.map((i) => ({
          menu_item_id: i.id, name: i.name,
          unit_price: i.price, quantity: i.quantity, subtotal: i.price * i.quantity,
        })),
        created_at: serverTimestamp(),
      });
      setSuccess(ref.id); clear(); setOpen(false);
    } catch (err) {
      console.error(err); toast.error("Couldn't place your order. Please try again.");
    } finally { setSubmitting(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSuccess(null); }}>
      <DialogContent className="max-w-lg">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-14 w-14 text-primary" />
            <DialogTitle className="font-display text-3xl tracking-wide">Order Placed!</DialogTitle>
            <DialogDescription>Reference: <span className="font-mono text-foreground">#{success.slice(0, 8).toUpperCase()}</span></DialogDescription>
            <p className="text-sm text-muted-foreground">We'll call you shortly to confirm delivery.</p>
            <Button className="mt-2" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl tracking-wide">Checkout</DialogTitle>
              <DialogDescription>Quick details for delivery.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-3">
              <div><Label htmlFor="customer_name">Full name</Label><Input id="customer_name" name="customer_name" required maxLength={80} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="customer_phone">Phone</Label><Input id="customer_phone" name="customer_phone" required placeholder="07XX XXX XXX" maxLength={20} /></div>
                <div><Label htmlFor="customer_email">Email (optional)</Label><Input id="customer_email" name="customer_email" type="email" maxLength={200} /></div>
              </div>
              <div><Label htmlFor="delivery_address">Delivery address</Label><Textarea id="delivery_address" name="delivery_address" required maxLength={300} rows={2} /></div>
              <div><Label htmlFor="notes">Notes (optional)</Label><Textarea id="notes" name="notes" maxLength={500} rows={2} placeholder="Gate code, allergies, etc." /></div>
              <div className="rounded-xl bg-muted/60 p-3 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatKES(subtotal)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{formatKES(DELIVERY_FEE)}</span></div>
                <div className="mt-2 flex justify-between border-t border-border pt-2 font-display text-xl"><span>Total</span><span>{formatKES(total)}</span></div>
              </div>
              <Button type="submit" disabled={submitting || items.length === 0} className="h-12 w-full font-bold">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Place order — {formatKES(total)}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}