import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatKES } from "@/lib/cart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: OrdersPage,
});

const STATUSES = ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  preparing: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  out_for_delivery: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-destructive/15 text-destructive",
};

async function fetchOrders() {
  const snap = await getDocs(query(collection(db, "orders"), orderBy("created_at", "desc")));
  return snap.docs.map((d) => {
    const data = d.data() as any;
    const created = data.created_at?.toDate?.() ?? new Date();
    return { id: d.id, ...data, created_at: created.toISOString(), order_items: data.items ?? [] };
  });
}

function firebaseErrorMessage(error: unknown, action: string) {
  const code = (error as { code?: string })?.code;
  if (code === "permission-denied") {
    return `Permission denied — sign in with a Firebase admin account and deploy firestore.rules. (${action})`;
  }
  return error instanceof Error ? error.message : `Failed to ${action}`;
}

function OrdersPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchOrders,
    retry: false,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateDoc(doc(db, "orders", id), { status });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "orders"] }); toast.success("Order updated"); },
    onError: (e: Error) => toast.error(firebaseErrorMessage(e, "update order")),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "orders", id));
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "orders"] }); toast.success("Order deleted"); },
    onError: (e: Error) => toast.error(firebaseErrorMessage(e, "delete order")),
  });

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">Orders</h1>
          <p className="text-sm text-muted-foreground">{data?.length ?? 0} total orders</p>
        </div>
      </div>
      {isLoading ? (
        <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-semibold text-destructive">Could not load orders</p>
          <p className="mt-2 text-sm text-muted-foreground">{firebaseErrorMessage(error, "load orders")}</p>
        </div>
      ) : !data?.length ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-12 text-center text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {data.map((o: any) => (
            <Collapsible key={o.id} className="rounded-xl border border-border bg-background shadow-sm">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <CollapsibleTrigger className="flex flex-1 items-center gap-3 text-left">
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform data-[state=open]:rotate-180" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{o.customer_name}</span>
                      <Badge variant="outline" className={statusColor[o.status]}>{o.status}</Badge>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()} · {o.customer_phone}</div>
                  </div>
                  <div className="font-display text-xl">{formatKES(Number(o.total))}</div>
                </CollapsibleTrigger>
                <Select value={o.status} onValueChange={(v) => updateStatus.mutate({ id: o.id, status: v })}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => confirm("Delete this order?") && remove.mutate(o.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <CollapsibleContent>
                <div className="border-t border-border px-4 py-4 text-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery</div>
                      <div className="mt-1">{o.delivery_address}</div>
                      {o.customer_email && <div className="text-muted-foreground">{o.customer_email}</div>}
                      {o.notes && <div className="mt-2 rounded-md bg-muted p-2 text-xs">{o.notes}</div>}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Items</div>
                      <ul className="mt-1 space-y-1">
                        {o.order_items.map((it: any, idx: number) => (
                          <li key={it.menu_item_id ?? idx} className="flex justify-between">
                            <span>{it.quantity}× {it.name}</span>
                            <span className="tabular-nums">{formatKES(Number(it.subtotal))}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 flex justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                        <span>Subtotal</span><span>{formatKES(Number(o.subtotal))}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Delivery</span><span>{formatKES(Number(o.delivery_fee))}</span>
                      </div>
                      <div className="flex justify-between font-display text-lg"><span>Total</span><span>{formatKES(Number(o.total))}</span></div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}