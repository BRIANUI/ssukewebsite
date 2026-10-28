import { MapPin, Phone, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Ssuke Pizza" className="h-10 w-10 rounded-lg shadow-sm" />
            <div>
              <div className="font-display text-3xl tracking-wide">SSUKE PIZZA</div>
              <div className="text-xs uppercase tracking-[0.2em] opacity-70">Bold. Hot. Delivered.</div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm opacity-80">Fast-casual kitchen serving pizzas, burgers, chicken and Kenyan favorites with no compromise on quality.</p>
        </div>
        <div id="about">
          <h4 className="font-display text-xl tracking-wide">Hours</h4>
          <ul className="mt-3 space-y-1.5 text-sm opacity-90">
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> Open 24/7</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl tracking-wide">Reach us</h4>
          <ul className="mt-3 space-y-1.5 text-sm opacity-90">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0741254279 / 0734343035</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Buruburu shopping centre, Mtindwa</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs opacity-70 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Ssuke Pizza. All rights reserved.</span>
          <span>Made with bold spice in Nairobi.</span>
        </div>
      </div>
    </footer>
  );
}