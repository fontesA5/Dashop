# Quick Setup Guide for dashop

This guide will help you get dashop running in about 10 minutes!

## Prerequisites Checklist

Make sure you have:
- ✅ Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- ✅ A code editor (VS Code recommended)
- ✅ A Supabase account ([supabase.com](https://supabase.com))
- ✅ Git installed (optional, but useful for version control)

---

## Step 1: Install Dependencies

```bash
cd dashop
npm install
```

**Expected output:**
```
added 200 packages in 45s
```

---

## Step 2: Set Up Supabase

### Create a New Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"Create a new project"**
3. Fill in:
   - **Name**: `dashop` (or your preferred name)
   - **Database password**: Choose a strong password
   - **Region**: Closest to you (for performance)
4. Click **"Create new project"**

### Get Your Supabase Credentials

1. Go to **Settings** > **API** in Supabase Dashboard
2. Copy these values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → Store securely (for admin operations)

---

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Create .env.local file
touch .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY-HERE
```

**⚠️ IMPORTANT:** Never commit `.env.local` to Git! Add it to `.gitignore`.

---

## Step 4: Set Up Database Schema

### Option A: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy the entire content from `schema.sql` in this project
4. Click **"Run"** button at the top
5. Wait for success message ("✓ Query ran successfully")

### Option B: Using CLI (Advanced)

If you have PostgreSQL CLI installed:

```bash
psql -h YOUR-SUPABASE-CONNECT-string.com -U postgres -d postgres << EOF
-- Paste schema.sql content here
EOF
```

---

## Step 5: Create Admin Account

### ⚠️ IMPORTANT: Must Use Supabase Dashboard UI!

The `auth.users` table in Supabase **does NOT allow direct SQL inserts** for security reasons. You MUST create your admin account through the Dashboard UI.

#### Quick Method: Use Supabase Dashboard UI (Required!)

Follow these steps:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your dashop project
3. Click **Authentication** → **Users** tab
4. Click **"+ Add user"** button
5. Fill in:
   - **Email**: `admin@dashop.com` (or your preferred email)
   - **Password**: Generate a strong password or create one
6. Click **"Add user"**
7. Wait 1-2 minutes for database to sync

✅ Done! Your account is ready to use the admin panel.

#### What You'll Have Automatically:
- ✅ Owner-level permissions in Supabase Dashboard
- ✅ Full access to all admin pages (`/admin/*` routes)
- ✅ Ability to manage products, orders, settings
- ✅ No special role setup needed - you're automatically an owner!

**📚 See [SETUP-ADMIN.md](./SETUP-ADMIN.md) for detailed step-by-step instructions with screenshots.**

📚 **See [SETUP-ADMIN.md](./SETUP-ADMIN.md) for detailed step-by-step instructions.**

---

## Step 6: Run Development Server

```bash
npm run dev
```

You should see:
```
- Ready in XXX ms
Local:            http://localhost:3000
```

Open your browser and go to: **http://localhost:3000**

---

## Step 7: Test the Store

### As a Customer:

1. Browse products (currently showing sample data)
2. Add items to cart
3. View cart at `/cart`
4. Checkout process works (won't charge without payment setup)

### As Admin:

1. Go to **http://localhost:3000/login**
2. Login with your admin email and password
3. Navigate to:
   - [/admin/dashboard](http://localhost:3000/admin/dashboard) - View analytics
   - [/admin/products](http://localhost:3000/admin/products) - Manage products
   - [/admin/orders](http://localhost:3000/admin/orders) - View orders
   - [/admin/analytics](http://localhost:3000/admin/analytics) - Detailed metrics
   - [/admin/settings](http://localhost:3000/admin/settings) - Store configuration

---

## Step 8: Add Sample Products (Optional)

To quickly populate your store with demo products:

1. Go to **http://localhost:3000/admin/products**
2. Click **"Add Product"** button
3. Fill in product details (see sample data in `public/sample-products.json`)
4. Save each product
5. Repeat for all products you want to add

**Or** manually upload your own product images and create custom products.

---

## Step 9: Test Email Notifications (Optional)

If you want email notifications for orders:

1. Sign up for [Resend](https://resend.com) (free tier available)
2. Get your API key from Resend dashboard
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxx
   ```
4. Configure in admin settings

---

## Step 10: Deploy to Production

See the deployment guides:

- **Cloudflare Pages** (Recommended): [DEPLOYMENT-CLOUDFLARE.md](./DEPLOYMENT-CLOUDFLARE.md)
- **Vercel**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Troubleshooting

### Problem: "Supabase connection failed"

**Solution:**
```bash
# Verify credentials in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Restart dev server
npm run dev
```

### Problem: "Database schema errors"

**Solution:**
1. Check all tables exist in Supabase Dashboard > Database > Tables
2. Re-run `schema.sql` if missing tables
3. Verify Row Level Security is enabled

### Problem: "Cannot read property 'id' of undefined"

**Solution:**
```bash
# Clear Next.js cache and restart
rm -rf .next
npm run dev
```

### Problem: "Images not loading"

**Solution:**
1. Add sample images to `public/images/` folder
2. Update product main_image_url paths in database
3. Or use placeholder images for testing

---

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Production
vercel deploy --prod # Deploy to Vercel
```

---

## Default Login Credentials

**Admin Panel:**
- URL: `http://localhost:3000/login`
- Email: [Your admin email]
- Password: [Your admin password]

---

## Documentation Links

- [README.md](./README.md) - Full documentation
- [SETUP-ADMIN.md](./SETUP-ADMIN.md) - Detailed admin setup guide
- [DEPLOYMENT-CLOUDFLARE.md](./DEPLOYMENT-CLOUDFLARE.md) - Production deployment (Cloudflare Pages)
- [schema.sql](./schema.sql) - Database schema reference
- Sample products: `public/sample-products.json`

---

## Need Help?

If you encounter issues:

1. Check browser console for errors (F12 → Console tab)
2. Review Supabase Dashboard logs
3. Check Vercel deploy logs (if deployed)
4. Open an issue in the project repository

---

**🎉 Congratulations! Your dashop store is ready!**

You can now:
- ✅ Browse products as a customer
- ✅ Add/remove items to cart
- ✅ Manage inventory via admin panel
- ✅ Track orders and analytics
- ✅ Customize product catalog

Next, deploy to production when you're ready for live sales! 🚀
