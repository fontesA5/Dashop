# Deployment Guide for dashop

## Overview

This guide covers deploying dashop to:
1. **Vercel** (Frontend hosting)
2. **Cloudflare** (DNS, CDN, SSL)
3. **Supabase** (Backend + Database)

---

## Step 1: Prepare Your Code

```bash
cd dashop
npm install
npm run build
# Ensure there are no build errors
```

---

## Step 2: Push to GitHub (or your preferred VCS)

```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub/GitLab
git remote add origin https://github.com/YOUR_USERNAME/dashop.git
git push -u origin main
```

---

## Step 3: Configure Supabase

### Create Project

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Create new project
3. Choose **Next.js** as framework (optional, but recommended)

### Database Setup

1. Go to **SQL Editor** in Supabase
2. Copy `schema.sql` content from this repo
3. Click "Run" to execute all SQL commands
4. Verify tables are created: Products, Orders, Categories, etc.

### Authentication Setup

1. Go to **Authentication** > **Users**
2. Add admin user (e.g., `admin@example.com`)
3. **Important**: Set password for admin user
4. In **Authentication** > **Policies**, verify RLS policies are enabled

### Environment Variables

Get these from Supabase Dashboard:
1. Go to **API** tab
2. Copy **Project URL** → Store as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon key** → Store as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role key** (for admin) → Store as `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 4: Deploy to Vercel

### Option A: Automatic via GitHub

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Set configuration:
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables (from Step 3):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click **"Deploy"**

### Option B: Manual Connect

```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

---

## Step 5: Configure Cloudflare

### DNS Settings

Log in to Cloudflare Dashboard and add these records:

| Type | Name | Value | Proxy Status |
|------|------|-------|--------------|
| CNAME | `@` | `YOUR_VERCEL_URL` (e.g., `dashop.vercel.app`) | 🟢 Proxied |
| CNAME | `www` | `YOUR_VERCEL_URL` | 🟢 Proxied |
| CNAME | `admin` | `YOUR_VERCEL_URL` | 🟢 Proxied |
| CNAME | `api` | `YOUR_VERCEL_URL` | 🟢 Proxied |

**Example:**
- If Vercel URL: `https://dashop.vercel.app`
- Cloudflare records:
  - `@` → `dashop.vercel.app`
  - `admin.dashop.com` → `dashop.vercel.app`

### SSL/TLS Settings

1. Go to **SSL/TLS** > **Overview**
2. Select **"Full (strict)"** mode
3. Let Vercel handle certificates

### Page Rules / Cache Rules

**Recommended:**
1. Go to **Cache Zone** > **Configuration**
2. Add cache rules:

| Pattern | Edge Cache TTL | Bypass Cache |
|---------|----------------|--------------|
| `/*` | 1 hour | ❌ |
| `/cart/*` | Bypass | ✅ |
| `/checkout/*` | Bypass | ✅ |
| `/api/*` | Bypass | ✅ |
| `/products/*` | 30 minutes | ❌ |

**Why bypass certain paths:**
- Cart needs real-time updates
- Checkout needs no cached pages
- API calls need fresh data

### Workers KV (Optional)

If you want to use Cloudflare Workers for custom functionality:

```bash
# Install Cloudflare CLI
npm install -g wrangler

# Create KV namespace
wrangler kv:namespace create DASHOP_CACHE

# Add to Vercel env if needed
```

---

## Step 6: Verify Deployment

### Test Checklist

- [ ] Homepage loads at `https://yourdomain.com`
- [ ] Product catalog works
- [ ] Shopping cart functions (add/remove items)
- [ ] Checkout page displays correctly
- [ ] Admin login works (`/login`)
- [ ] Admin dashboard accessible
- [ ] Email notifications work (if configured)

### Check Analytics

1. Open admin dashboard at `/admin/dashboard`
2. Verify stats are populated (may take 24 hours for initial data)

---

## Step 7: Post-Launch Setup

### Add Initial Products

Use the admin panel (`/admin/products`) to add your products:

1. Click **"Add Product"**
2. Fill in all fields
3. Upload product images
4. Set pricing and inventory
5. Publish (activate)

### Configure Email Notifications

1. Sign up for [Resend](https://resend.com) (free tier available)
2. Get API key from Resend dashboard
3. Add to Vercel environment variables: `RESEND_API_KEY`
4. Configure in admin settings

### Set Up Payment Processing (Optional)

#### Stripe Setup:

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get API keys (Development mode initially)
3. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### PayPal Setup:

1. Create PayPal Business account
2. Get Client ID from [developer.paypal.com](https://developer.paypal.com)
3. Add to `.env`:
   ```env
   PAYPAL_CLIENT_ID=your-client-id
   PAYPAL_CLIENT_SECRET=your-client-secret
   ```

---

## Troubleshooting

### Issue: "Supabase connection failed"

**Solution:**
1. Check environment variables in Vercel Dashboard
2. Verify Supabase project URL is correct
3. Ensure keys are not truncated

### Issue: Cart not persisting

**Solution:**
1. Check browser console for errors
2. Verify `cart_sessions` table exists in Supabase
3. Test with different browser/incognito mode

### Issue: Images not loading

**Solution:**
1. Check image URLs are accessible
2. Cloudflare cache may need purging
3. Verify CORS settings if using external image hosts

### Issue: Admin panel 404

**Solution:**
1. Ensure you're logged in as admin (`/login`)
2. Check RLS policies allow admin role
3. Try clearing Vercel cache and redeploying

---

## Performance Optimization

### Image Optimization

Next.js automatically optimizes images with `<Image>` component:

```tsx
// ✅ Good - uses Next.js image optimization
<img src="/images/product.jpg" alt="Product" />

// ❌ Bad - bypasses optimization
<img src="https://example.com/image.jpg" alt="External" />
```

### CDN Cache Strategy

Configure in Cloudflare:
- Static images (`.jpg`, `.png`, `.gif`): 1 hour cache
- CSS/JS files: 6 hours cache
- API responses: Bypass cache
- Cart pages: Bypass cache

### Database Indexes

Already included in schema.sql for performance:
- `analytics_events` indexed by `event_type` and `created_at`
- Unique constraints on slugs prevent duplicates

---

## Security Checklist

- [ ] Change admin password after first login
- [ ] Enable 2FA on Supabase account
- [ ] Never commit `.env.local` to git
- [ ] Use environment variables for all secrets
- [ ] Keep Next.js and dependencies updated
- [ ] Monitor Supabase usage (billing settings)

---

## Monitoring & Analytics

### Vercel Analytics

1. Go to Vercel Dashboard > Project > Analytics
2. Enable **Vercel Analytics** (formerly Web Vitals)
3. Review performance metrics

### Supabase Analytics

Check in Supabase Dashboard:
- **Settings** > **Usage** > **Metrics**
- Monitor database size and query performance

### Error Tracking

Set up optional error tracking:
- **Sentry**: Add to `package.json` scripts
- **LogRocket**: Browser session replay

---

## Scaling Considerations

If you need to scale beyond basic usage:

1. **Database**: Upgrade Supabase tier (free → pro)
2. **Storage**: Add Supabase Storage for images
3. **Edge Functions**: Move logic to Cloudflare Workers
4. **CDN**: Leverage Cloudflare global edge network

---

## Support

For deployment issues:
- Check Vercel deploy logs
- Review Supabase dashboard for errors
- Inspect browser console for JavaScript errors

---

**Happy deploying! 🚀**
