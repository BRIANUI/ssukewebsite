import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { signInAdmin } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import logo from "@/assets/ssuke-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Ssuke Pizza Admin" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    const ok = signInAdmin(String(f.get("username") ?? ""), String(f.get("password") ?? ""));
    setLoading(false);
    if (!ok) return toast.error("Invalid username or password");
    toast.success("Signed in");
    await router.invalidate();
    navigate({ to: "/admin" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[image:var(--gradient-warm)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo.url} alt="Ssuke" width={56} height={56} className="h-14 w-14 rounded-xl" />
          <h1 className="mt-3 font-display text-3xl tracking-wide">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage menu & orders.</p>
        </div>
        <form onSubmit={handleSignIn} className="space-y-3 pt-1">
          <div><Label htmlFor="username">Username</Label><Input id="username" name="username" autoComplete="username" required /></div>
          <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
          <Button type="submit" className="h-11 w-full font-bold" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}