-- =============================================
-- DASHOP DATABASE SCHEMA FOR SUPABASE
-- Safe to run multiple times in Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'US',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  inventory INTEGER DEFAULT 0,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  main_image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  sku VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. ORDERS TABLE (guest and authenticated)
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_guest BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  total DECIMAL(10,2) NOT NULL,
  items_count INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. ORDER ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. CART SESSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.cart_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total DECIMAL(10,2),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. ANALYTICS EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time ON public.analytics_events (event_type, created_at);

-- =============================================
-- 8. ROW LEVEL SECURITY POLICIES
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Public: Users can view profiles" ON public.profiles;
CREATE POLICY "Public: Users can view profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public: Users can insert profiles" ON public.profiles;
CREATE POLICY "Public: Users can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories policies
DROP POLICY IF EXISTS "Public: Anyone can view categories" ON public.categories;
CREATE POLICY "Public: Anyone can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (true);

-- Products policies
DROP POLICY IF EXISTS "Public: Anyone can view products" ON public.products;
CREATE POLICY "Public: Anyone can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (true);

-- Orders policies
DROP POLICY IF EXISTS "Users can view their orders" ON public.orders;
CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public: Anyone can view public orders" ON public.orders;
CREATE POLICY "Public: Anyone can view public orders" ON public.orders FOR SELECT USING (is_guest = true);

DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (true);

-- Order items policies
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = public.order_items.order_id AND public.orders.user_id = auth.uid()));

DROP POLICY IF EXISTS "Public: Anyone can view public order items" ON public.order_items;
CREATE POLICY "Public: Anyone can view public order items" ON public.order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = public.order_items.order_id AND public.orders.is_guest = true));

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (true);

-- Cart sessions policies
DROP POLICY IF EXISTS "Users can view their cart" ON public.cart_sessions;
CREATE POLICY "Users can view their cart" ON public.cart_sessions FOR SELECT USING (user_id = auth.uid() OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Public: Anyone can insert to cart" ON public.cart_sessions;
CREATE POLICY "Public: Anyone can insert to cart" ON public.cart_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public: Anyone can update cart" ON public.cart_sessions;
CREATE POLICY "Public: Anyone can update cart" ON public.cart_sessions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can manage carts" ON public.cart_sessions;
CREATE POLICY "Admins can manage carts" ON public.cart_sessions FOR ALL USING (true);

-- Analytics events
DROP POLICY IF EXISTS "Public: Anyone can view analytics" ON public.analytics_events;
CREATE POLICY "Public: Anyone can view analytics" ON public.analytics_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public: Anyone can log analytics" ON public.analytics_events;
CREATE POLICY "Public: Anyone can log analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- =============================================
-- 9. TRIGGERS (Auto-create profile on signup)
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 10. DEFAULT CATEGORIES SEED DATA
-- =============================================

INSERT INTO public.categories (name, slug, description) VALUES
  ('Household Essentials', 'household', 'Cleaning supplies, organization products, and household maintenance items'),
  ('Cleaning Supplies', 'cleaning', 'All-purpose cleaners, detergents, and specialty cleaning products'),
  ('Personal Care', 'personal-care', 'Skin care, grooming products, and personal hygiene essentials'),
  ('Beauty Products', 'beauty', 'Makeup, skincare, haircare, and beauty accessories')
ON CONFLICT (slug) DO NOTHING;
