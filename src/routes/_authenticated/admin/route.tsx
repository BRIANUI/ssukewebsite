import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Pizza, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return navigate({ to: "/auth" });
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
      setChecking(false);
    })();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    await router.invalidate();
    navigate({ to: "/auth" });
  }

  if (checking) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-[image:var(--gradient-warm)] p-6">
        <div className="max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-[var(--shadow-card)]">
          <h1 className="font-display text-3xl">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have admin access. Ask an existing admin to grant your user the <code>admin</code> role in the backend <code>user_roles</code> table.</p>
          <Button className="mt-5" onClick={signOut}>Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-xl tracking-wide">SSUKE · Admin</Link>
            <nav className="flex items-center gap-1">
              <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary text-secondary-foreground" }} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-muted">
                <ClipboardList className="h-4 w-4" /> Orders
              </Link>
              <Link to="/admin/menu" activeProps={{ className: "bg-secondary text-secondary-foreground" }} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-muted">
                <Pizza className="h-4 w-4" /> Menu
              </Link>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2"><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><Outlet /></main>
    </div>
  );
}