import type { MenuItem } from "@/components/product-dialog";

export const DEFAULT_MENU: Omit<MenuItem, "id">[] = [
  { name: "Margherita Pizza", description: "Classic tomato, mozzarella & fresh basil on a hand-tossed crust.", price: 950, category: "Pizza", image_url: null, available: true },
  { name: "BBQ Chicken Pizza", description: "Smoky BBQ chicken, red onions, peppers & mozzarella.", price: 1250, category: "Pizza", image_url: null, available: true },
  { name: "Beef Supreme Pizza", description: "Seasoned beef mince, peppers, onions, olives, mozzarella.", price: 1350, category: "Pizza", image_url: null, available: true },
  { name: "Veggie Deluxe Pizza", description: "Peppers, onions, mushrooms, olives & sweetcorn.", price: 1100, category: "Pizza", image_url: null, available: true },
  { name: "Classic Beef Burger", description: "Flame-grilled beef patty, cheddar, lettuce, tomato, house sauce.", price: 650, category: "Burgers", image_url: null, available: true },
  { name: "Crispy Chicken Burger", description: "Buttermilk-fried chicken, slaw & spicy mayo on a brioche bun.", price: 700, category: "Burgers", image_url: null, available: true },
  { name: "Loaded Fries", description: "Crispy fries topped with cheese sauce, beef & jalapeños.", price: 450, category: "Sides", image_url: null, available: true },
  { name: "Chicken Wings (6 pcs)", description: "BBQ or peri-peri glazed wings, served with dip.", price: 550, category: "Sides", image_url: null, available: true },
  { name: "Beef Pilau", description: "Spiced rice with tender beef, served with kachumbari.", price: 500, category: "Mains", image_url: null, available: true },
  { name: "Nyama Choma Wrap", description: "Grilled beef strips, salad & tangy sauce in a soft tortilla.", price: 450, category: "Mains", image_url: null, available: true },
  { name: "Ugali & Beef Stew", description: "House beef stew with sukuma wiki and warm ugali.", price: 400, category: "Mains", image_url: null, available: true },
  { name: "Chips Masala", description: "Crispy chips tossed in our signature masala spice.", price: 350, category: "Sides", image_url: null, available: true },
  { name: "Dawa Lemonade", description: "Honey, ginger & lemon over ice. Kenyan classic.", price: 200, category: "Drinks", image_url: null, available: true },
  { name: "Passion Juice", description: "Freshly squeezed passion fruit, no added sugar.", price: 180, category: "Drinks", image_url: null, available: true },
  { name: "Soda 500ml", description: "Coke, Fanta or Sprite.", price: 120, category: "Drinks", image_url: null, available: true },
  { name: "Chocolate Brownie", description: "Warm fudgy brownie with vanilla ice cream.", price: 350, category: "Desserts", image_url: null, available: true },
];