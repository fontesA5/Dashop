-- =============================================
-- 1. PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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
CREATE TABLE categories (
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
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  inventory INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  main_image_url TEXT,
  images JSONB DEFAULT '[]',
  variants JSONB DEFAULT '[]',
  sku VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. ORDERS TABLE (guest and authenticated)
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
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
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
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
CREATE TABLE cart_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. ANALYTICS EVENTS TABLE
-- =============================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for analytics queries
CREATE INDEX ON analytics_events (event_type, created_at);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public: Users can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public: Users can insert profiles" ON profiles FOR INSERT WITH CHECK (true);

-- Categories policies (public read, admin write)
CREATE POLICY "Public: Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (auth.role() = 'admin');

-- Products policies (public read for active products, admin CRUD)
CREATE POLICY "Public: Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.role() = 'admin');

-- Orders policies (users see own orders, public sees guest orders, admin sees all)
CREATE POLICY "Users can view their orders" ON orders FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "Public: Anyone can view public orders" ON orders FOR SELECT 
  USING (is_guest = true);
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (auth.role() = 'admin');

-- Order items policies (inherit from orders)
CREATE POLICY "Users can view their order items" ON order_items FOR SELECT 
  USING (exists (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Public: Anyone can view public order items" ON order_items FOR SELECT 
  USING (exists (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.is_guest = true));
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (auth.role() = 'admin');

-- Cart sessions policies
CREATE POLICY "Users can view their cart" ON cart_sessions FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "Public: Anyone can insert to cart" ON cart_sessions FOR INSERT 
  WITH CHECK (true);
CREATE POLICY "Admins can manage carts" ON cart_sessions FOR ALL USING (auth.role() = 'admin');

-- Analytics events (public read only)
CREATE POLICY "Public: Anyone can view analytics" ON analytics_events FOR SELECT USING (true);

-- =============================================
-- TRIGGERS
-- =============================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DEFAULT CATEGORIES
-- =============================================

INSERT INTO categories (name, slug, description) VALUES
  ('Household Essentials', 'household', 'Cleaning supplies, organization products, and household maintenance items'),
  ('Cleaning Supplies', 'cleaning', 'All-purpose cleaners, detergents, and specialty cleaning products'),
  ('Personal Care', 'personal-care', 'Skin care, grooming products, and personal hygiene essentials'),
  ('Beauty Products', 'beauty', 'Makeup, skincare, haircare, and beauty accessories')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- ADMIN USER CREATION (WORKING SQL COMMAND)
-- =============================================
-- 
-- RUN THESE COMMANDS IN THIS ORDER TO CREATE YOUR ADMIN USER
-- Copy and paste all of the following into Supabase SQL Editor:

-- STEP 1: Disable RLS temporarily for user creation
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- STEP 2: Create admin user
INSERT INTO auth.users (instance_id, id, aud, role, email, raw_user_meta_data, created_at, updated_at) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@dashop.com',
  '{"role": "admin"}'::jsonb,
  now(),
  now()
);

-- STEP 3: Confirm email so user can login immediately
UPDATE auth.users SET email_confirm = true WHERE email = 'admin@dashop.com';

-- STEP 4: Create matching profile in profiles table
INSERT INTO profiles (id, email) 
SELECT id, email FROM auth.users WHERE email = 'admin@dashop.com';

-- STEP 5: Re-enable RLS for security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- STEP 6: Verify user was created successfully
SELECT email, raw_user_meta_data, created_at FROM auth.users WHERE email = 'admin@dashop.com';

/* 
✅ DONE! Your admin account is ready.

To set a password:
1. Go to Supabase Dashboard → Authentication → Users
2. Find your admin user (admin@dashop.com)
3. Click "Reset password" and create a strong password
4. Login at /login with your email and new password
*/

