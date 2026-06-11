import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { signOutAdmin } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Pizza, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const router = useRouter();

  async function signOut() {
    signOutAdmin();
    toast.success("Signed out");
    await router.invalidate();
    navigate({ to: "/auth" });
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