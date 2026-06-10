import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { CartSheet } from "@/components/cart-sheet";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ssuke Pizza — Order Pizzas, Burgers & Kenyan Classics" },
      { name: "description", content: "Bold pizzas, smashed burgers, crispy chicken and Kenyan favorites — delivered hot from Ssuke Pizza in Nairobi." },
      { property: "og:title", content: "Ssuke Pizza — Bold Flavors, Delivered Hot" },
      { property: "og:description", content: "Order online for fast delivery across Nairobi." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <MenuSection />
      </main>
      <SiteFooter />
      <CartSheet />
    </div>
  );
}
