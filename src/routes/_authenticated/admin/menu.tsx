import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatKES } from "@/lib/cart";

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: MenuAdmin,
});

type MenuRow = {
  id: string; name: string; description: string | null; price: number;
  category: string; image_url: string | null; available: boolean; sort_order: number;
};

async function fetchAll(): Promise<MenuRow[]> {
  const { data, error } = await supabase.from("menu_items").select("*").order("sort_order");
  if (error) throw error;
  return (data ?? []) as MenuRow[];
}

const empty: Partial<MenuRow> = { name: "", description: "", price: 0, category: "", image_url: "", available: true, sort_order: 0 };

function MenuAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "menu"], queryFn: fetchAll });
  const [editing, setEditing] = useState<Partial<MenuRow> | null>(null);

  const save = useMutation({
    mutationFn: async (row: Partial<MenuRow>) => {
      const payload = {
        name: row.name!, description: row.description || null, price: Number(row.price) || 0,
        category: row.category!, image_url: row.image_url || null,
        available: !!row.available, sort_order: Number(row.sort_order) || 0,
      };
      if (row.id) {
        const { error } = await supabase.from("menu_items").update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "menu"] }); qc.invalidateQueries({ queryKey: ["menu", "public"] }); setEditing(null); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "menu"] }); qc.invalidateQueries({ queryKey: ["menu", "public"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">Menu</h1>
          <p className="text-sm text-muted-foreground">{data?.length ?? 0} items</p>
        </div>
        <Button onClick={() => setEditing({ ...empty })} className="gap-2"><Plus className="h-4 w-4" /> New item</Button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Avail.</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-secondary">
                        {m.image_url ? <img src={m.image_url} alt="" className="h-full w-full object-cover" /> : null}
                      </div>
                      <div>
                        <div className="font-semibold">{m.name}</div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">{m.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{m.category}</td>
                  <td className="px-4 py-3 text-right font-display">{formatKES(Number(m.price))}</td>
                  <td className="px-4 py-3 text-center">{m.available ? "✓" : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(m)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => confirm(`Delete ${m.name}?`) && remove.mutate(m.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit item" : "New item"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div><Label>Name</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                <div><Label>Price (KES)</Label><Input type="number" step="1" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Image URL</Label><Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Sort order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
                <div className="flex items-end gap-3"><Switch checked={!!editing.available} onCheckedChange={(v) => setEditing({ ...editing, available: v })} /><Label>Available</Label></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save.mutate(editing)} disabled={save.isPending}>
              {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}