import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email") ?? ""), password: String(f.get("password") ?? ""),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    await router.invalidate();
    navigate({ to: "/admin" });
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: String(f.get("email") ?? ""), password: String(f.get("password") ?? ""),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You can sign in now.");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[image:var(--gradient-warm)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo.url} alt="Ssuke" width={56} height={56} className="h-14 w-14 rounded-xl" />
          <h1 className="mt-3 font-display text-3xl tracking-wide">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage menu & orders.</p>
        </div>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-3 pt-3">
              <div><Label htmlFor="si-email">Email</Label><Input id="si-email" name="email" type="email" required /></div>
              <div><Label htmlFor="si-password">Password</Label><Input id="si-password" name="password" type="password" required minLength={6} /></div>
              <Button type="submit" className="h-11 w-full font-bold" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign in</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-3 pt-3">
              <div><Label htmlFor="su-email">Email</Label><Input id="su-email" name="email" type="email" required /></div>
              <div><Label htmlFor="su-password">Password</Label><Input id="su-password" name="password" type="password" required minLength={6} /></div>
              <Button type="submit" variant="secondary" className="h-11 w-full font-bold" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create account</Button>
              <p className="text-center text-xs text-muted-foreground">After creating an account, grant yourself the admin role from Cloud → user_roles table.</p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}