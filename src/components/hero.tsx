import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-food.jpg";
import { ArrowRight, Clock, Flame } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[image:var(--gradient-warm)]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-background/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            <Flame className="h-3.5 w-3.5" /> Open · Delivering Now
          </div>
          <h1 className="mt-5 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] tracking-wide text-secondary">Bold flavors.<br />Delivered hot.</h1>
          <p className="mt-5 max-w-md text-lg text-secondary/80">Hand-tossed pizzas, smashed burgers, crispy chicken, and Kenyan classics — cooked fresh and at your door in 30 minutes.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 gap-2 px-6 text-base font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <a href="#menu">Order Now <ArrowRight className="h-4 w-4" /></a>
            </Button>
            <div className="flex items-center gap-2 text-sm font-semibold text-secondary/80"><Clock className="h-4 w-4" /> Avg. 30 min delivery</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-secondary/15 blur-3xl" aria-hidden />
          <img src={heroImg} alt="Signature beef burger with crispy fries" width={1536} height={1024} className="relative rounded-3xl border-8 border-background object-cover shadow-[0_30px_80px_-30px_oklch(0.22_0.05_55/0.6)]" />
        </div>
      </div>
    </section>
  );
}