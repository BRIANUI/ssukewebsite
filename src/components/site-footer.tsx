import logo from "@/assets/ssuke-logo.png.asset.json";
import { MapPin, Phone, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="Ssuke Pizza" width={48} height={48} className="h-12 w-12 rounded-xl" />
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
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> Mon–Thu · 10am – 11pm</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> Fri–Sun · 10am – 1am</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl tracking-wide">Reach us</h4>
          <ul className="mt-3 space-y-1.5 text-sm opacity-90">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +254 700 000 000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Ngong Road, Nairobi</li>
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