import { Link } from "@tanstack/react-router";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import logo from "@/assets/ssuke-logo.png.asset.json";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="Ssuke Pizza" width={40} height={40} className="h-10 w-10 rounded-lg shadow-sm" />
          <div className="leading-none">
            <div className="font-display text-2xl tracking-wide text-foreground">SSUKE PIZZA</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Bold. Hot. Delivered.</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-foreground/80">
          <a href="#menu" className="hover:text-foreground transition-colors">Menu</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-2">
              <ShieldCheck className="h-4 w-4" /> Admin
            </Button>
          </Link>
          <Button onClick={() => setOpen(true)} className="relative gap-2 font-semibold">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-bold text-secondary-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}