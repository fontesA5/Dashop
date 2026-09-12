# dashop - E-commerce Store Platform

A minimalistic, mobile-first e-commerce platform built with Next.js, Supabase, and Tailwind CSS for household essentials, cleaning supplies, personal care, and beauty products.

![dashop](https://img.shields.io/badge/Next.js-14-black) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features

### For Customers
- ✅ Mobile-first responsive design
- ✅ Product catalog with categories (Household, Cleaning, Personal Care, Beauty)
- ✅ Shopping cart with persistent storage
- ✅ Guest checkout support
- ✅ Search & filter functionality
- ✅ User accounts with order history
- ✅ Secure checkout process

### For Admins
- ✅ Admin dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Sales & visitor analytics
- ✅ Inventory tracking & low-stock alerts
- ✅ Email notifications setup

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Deployment**: Vercel (hosting) + Cloudflare (DNS/CDN)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Domain name configured in Cloudflare

### Installation

```bash
cd dashop
npm install

# Copy and edit environment variables
cp .env.example .env.local
```

### Configure Environment Variables

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email notifications (optional)
RESEND_API_KEY=your-resend-api-key
```

### Database Setup

Run the Supabase SQL migrations to create all tables:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and run the schema from `schema.sql` (created below)

### Development

```bash
npm run dev
# opens http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
dashop/
├── app/
│   ├── (store)/           # Public store pages
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product catalog
│   │   ├── cart/          # Shopping cart
│   │   └── checkout/      # Checkout flow
│   ├── (admin)/           # Admin dashboard
│   │   ├── dashboard/     # Analytics overview
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   └── analytics/     # Detailed analytics
│   ├── login/             # Admin login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Redirect to store
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── product/           # Product display components
│   ├── cart/              # Cart UI components
│   └── search/            # Search & filter UI
├── lib/
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript interfaces
└── public/                # Static assets
```

## Admin Access

- **URL**: `/login`
- **Default Credentials**: `admin@example.com` / `admin`
- Change these immediately after first login!

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Cloudflare Setup

1. **DNS Configuration**:
   - `@` → Vercel URL (e.g., `dashop.vercel.app`)
   - `admin.dashop.com` → Vercel URL
   
2. **Cloudflare Cache Rules**:
   - Bypass cache for `/cart`, `/checkout`, `/api/*`
   - Cache static assets with 1-hour TTL

3. **SSL Mode**: Flexible (lets Vercel handle SSL)

## Database Schema

Run this SQL in Supabase to create all tables:

```sql
-- Users profile (extends auth.users)
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

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
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

-- Orders (guest and authenticated users)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  is_guest BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  total DECIMAL(10,2) NOT NULL,
  items_count INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
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

-- Cart Sessions (sync with auth for logged-in users)
CREATE TABLE cart_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for analytics queries
CREATE INDEX ON analytics_events (event_type, created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create public access policies for read operations
CREATE POLICY "Public: Users can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public: Users can insert profiles" ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Public: Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Public: Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public: Users can insert products to cart" ON products FOR INSERT 
  WITH CHECK (true); -- Cart insert handled in app logic
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Users can view their orders" ON orders FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "Public: Anyone can view public orders" ON orders FOR SELECT 
  USING (is_guest = true);
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Users can view their cart" ON cart_sessions FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "Public: Anyone can insert to cart" ON cart_sessions FOR INSERT 
  WITH CHECK (true);
CREATE POLICY "Admins can manage carts" ON cart_sessions FOR ALL 
  USING (auth.role() = 'admin');

-- Function to handle profile creation after signup
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
```

## Default Categories

Add these categories in Supabase or via admin panel:

1. **Household Essentials** (`household`) - Cleaning supplies, organization
2. **Cleaning Supplies** (`cleaning`) - All-purpose cleaners, detergents
3. **Personal Care** (`personal-care`) - Skin care, grooming products
4. **Beauty Products** (`beauty`) - Makeup, skincare, cosmetics

## API Endpoints (Server Actions)

```typescript
// lib/supabase.ts exports:
- supabase (client for public operations)
- supabaseAdmin (service role for admin operations)
```

## Analytics Dashboard

The dashboard provides real-time insights:

- Total sales & revenue trends
- Top-selling products
- Visitor count and engagement metrics
- Low-stock inventory alerts
- Order status breakdown

## Payment Integration

This project is **payment-integration-ready**. Currently, checkout accepts card details in the frontend. To process payments:

1. **Stripe**: Add Stripe keys and use `@stripe/webpack-plugin`
2. **PayPal**: Add PayPal JS SDK buttons
3. **Supabase Functions**: Set up payment webhooks for order status updates

## Email Notifications

Optional setup with Resend (or Supabase Email functions):

1. Sign up for [Resend](https://resend.com)
2. Add API key to `.env.local`
3. Configure in admin settings

## License

MIT License - feel free to use this project for your own e-commerce store!

## Support

For questions or issues, contact the developer or open an issue on GitHub.

---

**Built with ❤️ using Next.js + Supabase + Tailwind CSS**
