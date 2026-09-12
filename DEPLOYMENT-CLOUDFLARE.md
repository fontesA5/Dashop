# Deployment Guide: Cloudflare Pages + Supabase

This guide covers deploying dashop to **Cloudflare Pages** (not Vercel).

---

## Why Use Cloudflare Pages?

✅ **Free tier**: Generous bandwidth and build limits  
✅ **Built-in CDN**: Automatic caching at the edge  
✅ **Global network**: Fast worldwide performance  
✅ **Integrated with Cloudflare DNS**: Single dashboard for everything  
✅ **Next.js support**: Full Next.js 14 compatibility  

---

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ GitHub/GitLab/Bitbucket account (for Git deployment)
- ✅ Supabase project created
- ✅ Domain name pointed to Cloudflare

---

## Step 1: Prepare Your Project

```bash
cd dashop
npm install
# Optional: Test locally first
npm run dev
```

---

## Step 2: Configure Environment Variables

Create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY

# Optional - Email notifications (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxx

# Optional - Payment processing
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxx
```

**⚠️ IMPORTANT**: Never commit `.env.local` to Git! It will be auto-detected and rejected by Cloudflare Pages.

---

## Step 3: Connect GitHub (Recommended)

### Option A: Deploy via GitHub Repository

1. **Create a GitHub repository** (or use existing one)
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit - dashop"
# Push to your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/dashop.git
git push -u origin main
```

3. **Create Cloudflare Pages project**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create a site
   - Select **"Connect to Git"**
   - Choose your GitHub repository (`dashop`)
   - Configure build settings (see Step 4 below)

### Option B: Manual Build via UI

If you don't want to use Git:
1. Go to Cloudflare Dashboard → Pages → Create a site
2. Select **"Upload assets"**
3. Upload your entire `dashop` folder
4. Configure build settings (Step 4)

---

## Step 4: Build Settings for Cloudflare Pages

In the Cloudflare Pages dashboard, configure these settings:

### Build and Deploy Settings:

| Setting | Value |
|---------|-------|
| **Production branch** | `main` (or your default branch) |
| **Build command** | `npm run build` |
| **Output directory** | `.next` |
| **Node version** | `18.x` or `20.x` |

### Environment Variables:

Click **"Edit environment variables"** and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: These must be added to both **Development** and **Production** environments.

---

## Step 5: Build and Deploy

Click **"Save and Deploy"** at the bottom of the settings panel.

Cloudflare will:
1. Clone your repository
2. Run `npm install`
3. Run `npm run build`
4. Deploy to Cloudflare's edge network

**Deployment time**: Typically 1-2 minutes for small projects.

---

## Step 6: Domain Configuration in Cloudflare

Since you're already using Cloudflare, domain setup is automatic:

### DNS Records Needed:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | `@` | Pages subdomain from Cloudflare | 🟢 Orange (Proxied) |
| CNAME | `www` | Pages subdomain | 🟢 Orange (Proxied) |

**Example:**
- If Cloudflare gives you: `dashop.pages.dev`
- Your records will be:
  - `@` → `dashop.pages.dev` (automatically managed by Cloudflare)
  - `www` → `dashop.pages.dev`

### Custom Domain Setup:

To use your own domain (e.g., `yourstore.com`):

1. Go to **Pages** → Your site → **Domains**
2. Click **"Add a custom domain"**
3. Enter your domain (e.g., `yourstore.com`)
4. Update DNS records in Cloudflare Dashboard:
   - Add A record for `@` pointing to Cloudflare's IP
5. Wait for SSL certificate to provision (automatic)

---

## Step 7: Configure Cache Rules

Cloudflare Pages has different caching behavior than Vercel:

### Go to: **Workers & Pages** → Your site → **Cache Level**

Set to: **"Standard"** or **"Aggressive"** (for static-heavy sites)

### Create Cache Rules:

Go to **Rules** → Add rule for each pattern:

| Pattern | Edge Cache TTL | Bypass Cache? |
|---------|----------------|----------------|
| `/cart/*` | 0 seconds | ✅ Yes (must bypass) |
| `/checkout/*` | 0 seconds | ✅ Yes (must bypass) |
| `/api/*` | 0 seconds | ✅ Yes (must bypass) |
| `/products/*` | 30 minutes | ❌ No |
| `/images/*` | 1 hour | ❌ No |
| `/css/*`, `/js/*` | 6 hours | ❌ No |

**Why bypass certain paths:**
- Cart needs real-time updates from Supabase
- Checkout must never serve cached pages
- API calls need fresh data
- Static assets can be cached safely

---

## Step 8: Update Build Configuration (Optional)

If you encounter build issues, create `wrangler.toml` for Cloudflare-specific optimizations:

```toml
# wrangler.toml - Optional but recommended for Cloudflare Pages
compatibility_date = "2024-01-01"

[vars]
NEXT_PUBLIC_SUPABASE_URL = "${NEXT_PUBLIC_SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
```

**Note**: For most Next.js projects, this isn't necessary. Stick to environment variables in Pages settings.

---

## Step 9: Verify Deployment

Test your deployed site:

- ✅ Homepage loads at `https://your-domain.com`
- ✅ Product catalog works
- ✅ Cart functionality (add/remove items)
- ✅ Checkout page functional
- ✅ Admin login accessible
- ✅ All pages responsive on mobile

---

## Step 10: Post-Deployment Tasks

### A. Configure Supabase Production Settings

1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Ensure your production API keys are set (they're already in `.env`)
3. Verify database connection strings work

### B. Set Up Email Notifications (Optional)

1. Sign up for [Resend](https://resend.com)
2. Add `RESEND_API_KEY` to Cloudflare Pages environment variables
3. Test by creating a test order in admin panel

### C. Enable Analytics

In Cloudflare Dashboard:
- Go to **Analytics** → **Dashboard**
- Review page views, load times, and errors

---

## Cloudflare Pages vs Vercel Comparison

| Feature | Cloudflare Pages | Vercel |
|---------|------------------|--------|
| **Free Tier Bandwidth** | 100 GB/month | 100 GB/month |
| **Build Minutes** | Unlimited (free) | 100/hour (free) |
| **CDN** | Built-in (global edge) | Built-in (global edge) |
| **Deployment Speed** | Fast (Cloudflare network) | Very fast (optimized) |
| **Next.js Support** | ✅ Full support | ✅ Native integration |
| **Cache Rules** | ✅ Flexible via Workers | ✅ Built-in |
| **Form Handling** | Cloudflare Forms available | Formspree/Vercel functions |
| **Functions** | Cloudflare Workers available | Vercel Functions |

**Recommendation**: Cloudflare Pages is excellent for:
- Static-heavy sites (e-commerce with images)
- Wanting everything under one provider (Cloudflare)
- Lower bandwidth needs

---

## Troubleshooting Common Issues

### Issue: "Build failed" in Cloudflare Pages

**Solution:**
```bash
# Check your .gitignore includes .next/
# Ensure node_modules is NOT committed to Git

# Try cleaning and rebuilding
npm run clean  # if you have this script
rm -rf node_modules
npm install
npm run build
```

### Issue: "Environment variables not found"

**Solution:**
1. Go to Cloudflare Dashboard → Pages → Your site
2. Click **"Settings"** → **"Environment variables"**
3. Add all required env vars (see Step 6)
4. Click **"Save and redeploy"**

### Issue: Cart not persisting after deployment

**Solution:**
1. Clear browser cache and localStorage
2. Check Supabase `cart_sessions` table exists in database
3. Verify RLS policies allow cart operations

### Issue: "502 Bad Gateway" on Cloudflare

**Solution:**
1. Check if `.next` directory is being generated correctly
2. Review build logs in Cloudflare Dashboard
3. Ensure output directory is set to `.next`

---

## Security Configuration for Cloudflare Pages

### 1. Enable WAF (Web Application Firewall)

Go to **Security** → **WAF** → Enable protection:

| Rule Type | Setting |
|-----------|---------|
| **Attack Types** | Block SQLi, XSS attempts |
| **Bot Management** | Moderate protection |
| **Brute Force Protection** | Enabled for login pages |

### 2. Configure SSL/TLS

In Cloudflare Dashboard:
- Go to **SSL/TLS** → **Overview**
- Select **"Full (strict)"** mode
- Let Vercel/Cloudflare handle certificate management

### 3. Enable Bot Fight Mode

- Go to **Security** → **Bot Fight Mode**
- Enable for production traffic
- Reduces bot attacks and crawl spam

---

## Cost Comparison (Free Tier)

### Cloudflare Pages Free:
- ✅ 100 GB/month bandwidth
- ✅ Unlimited build minutes
- ✅ Unlimited projects
- ✅ Free SSL certificates
- ✅ CDN included

### Supabase Free:
- ✅ 500 MB database storage
- ✅ 50 million monthly requests
- ✅ Free hosting for functions
- ✅ Built-in backups

**Total**: Completely free to deploy and run! (No credit card needed)

---

## Performance Optimization Tips

### 1. Image Optimization

Next.js automatically optimizes images when using `<Image>` component:

```tsx
// ✅ Correct - uses Next.js Image optimization
import Image from 'next/image'

<Image 
  src="/images/product.jpg" 
  alt="Product name" 
  width={400}
  height={400}
/>

// ❌ Avoid this - bypasses optimization
<img src="/images/product.jpg" />
```

### 2. Minimize Client-Side Code

Keep your app lean:
- Lazy load non-critical components
- Use dynamic imports for large libraries
- Keep bundle size under 1MB

### 3. Enable Compression

Cloudflare Pages automatically serves Brotli/ gzip compressed responses.

### 4. Use Next.js Data Fetching

Prefer async server actions over client-side fetching when possible:

```tsx
// ✅ Server-side fetch (no API call)
const products = await supabase.from('products')
  .select('*')
  .eq('is_active', true)

// ❌ Avoid unnecessary API endpoints for simple data
```

---

## Monitoring & Analytics

### Cloudflare Analytics:
- **Pages Analytics**: View page load times and errors
- **Network Traffic**: Monitor bandwidth usage
- **Geographic Distribution**: See visitor locations

### Supabase Dashboard:
- **Settings** → **Usage** → View database metrics
- **SQL Editor** → Check query performance
- **Database Size** → Monitor storage usage

---

## Migration from Vercel (If You Switch)

If you deployed on Vercel and want to move to Cloudflare Pages:

1. Push latest code with all env vars updated
2. In Cloudflare Pages, import the same GitHub repository
3. Configure build settings as in Step 4
4. Both sites can run simultaneously during migration
5. Update DNS records when ready

**No database changes needed!** Supabase is independent of hosting platform.

---

## Support Resources

- **Cloudflare Docs**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Cloudflare Guide**: [nextjs.org/docs/deployment/cloudflare-pages](https://nextjs.org/docs/deployment/cloudflare-pages)

---

## Deployment Checklist (Cloudflare Pages)

- [ ] Code pushed to GitHub repository
- [ ] `.env.local` NOT committed to Git
- [ ] Cloudflare Pages project connected to repo
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Environment variables configured
- [ ] Cache rules applied (bypass for `/cart`, `/checkout`, `/api`)
- [ ] SSL certificate provisioned
- [ ] WAF enabled for protection
- [ ] Deployment successful
- [ ] All pages tested in production

---

**🎉 Your dashop store is now deployed on Cloudflare Pages!**

For detailed setup instructions, see:
- `SETUP.md` - Initial setup guide
- `README.md` - Full documentation
- `schema.sql` - Database schema
