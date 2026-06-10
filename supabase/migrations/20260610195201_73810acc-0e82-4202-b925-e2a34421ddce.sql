
-- Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Menu items
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image_url text,
  available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available menu items" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage menu items" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text NOT NULL,
  notes text,
  subtotal numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','preparing','out_for_delivery','completed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Order items
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  name text NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  subtotal numeric(10,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT INSERT ON public.order_items TO anon;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone insert order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER menu_items_updated BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed menu items (Kenyan-leaning fast food)
INSERT INTO public.menu_items (name, description, price, category, sort_order) VALUES
('Classic Beef Burger', 'Juicy grilled beef patty, cheddar, lettuce, tomato & secret sauce on a toasted brioche bun.', 650, 'Burgers', 1),
('Chicken Zinger Burger', 'Crispy hand-breaded chicken fillet, slaw, pickles and spicy mayo.', 700, 'Burgers', 2),
('Double Cheese Burger', 'Two beef patties stacked with melted cheese, caramelized onions and house sauce.', 850, 'Burgers', 3),
('Pepperoni Pizza (12")', 'Hand-tossed pizza loaded with pepperoni and mozzarella over rich tomato base.', 1200, 'Pizza', 4),
('BBQ Chicken Pizza (12")', 'Smoky BBQ sauce, grilled chicken, red onions and fresh coriander.', 1300, 'Pizza', 5),
('Veggie Supreme Pizza (12")', 'Bell peppers, mushrooms, olives, onions and sweet corn on a herby base.', 1100, 'Pizza', 6),
('Chicken & Chips', 'Two pieces of crispy fried chicken with golden chips and dipping sauce.', 550, 'Chicken'  , 7),
('12pc Chicken Bucket', 'Family bucket of crunchy fried chicken — original or spicy.', 1800, 'Chicken', 8),
('Beef Pilau Bowl', 'Aromatic Swahili-style pilau with tender beef, kachumbari and chilli sauce.', 500, 'Bowls', 9),
('Nyama Choma Wrap', 'Grilled goat strips, ugali fries, kachumbari & tangy mayo in a warm tortilla.', 600, 'Wraps', 10),
('Samosa Trio (Beef)', 'Three crispy hand-folded beef samosas with tamarind chutney.', 250, 'Sides', 11),
('Loaded Chips Mwitu', 'Crispy chips smothered in cheese, beef stew and crispy onions.', 450, 'Sides', 12),
('Mandazi Quartet', 'Four fluffy cardamom mandazi dusted with sugar.', 200, 'Sides', 13),
('Stoney Tangawizi 500ml', 'Ice-cold ginger soda.', 120, 'Drinks', 14),
('Fresh Mango Juice', 'Hand-blended ripe mango with a hint of lime.', 250, 'Drinks', 15),
('Dawa Lemonade', 'Honey, ginger, lime — the Kenyan classic.', 220, 'Drinks', 16);
