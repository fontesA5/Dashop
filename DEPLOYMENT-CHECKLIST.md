# Deployment Checklist for dashop

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment Tasks

### Code & Testing
- [ ] All features working locally (test all pages)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Test with different browsers (Chrome, Firefox, Safari)
- [ ] Mobile responsive check (all screen sizes)
- [ ] Add sample products via admin panel (at least 10 products)

### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured
- [ ] Optional: `RESEND_API_KEY` for email notifications
- [ ] Optional: Payment provider keys (Stripe/PayPal)

### Database Setup
- [ ] Schema SQL executed in Supabase
- [ ] Admin user created with proper permissions
- [ ] Row Level Security policies verified
- [ ] Default categories inserted
- [ ] Test data added (products, sample orders if any)

### Files to Commit
- [ ] All source code (`app/`, `components/`, `lib/`, etc.)
- [ ] `package.json` with correct dependencies
- [ ] `tsconfig.json`
- [ ] `tailwind.config.ts`
- [ ] `next.config.js`
- [ ] `README.md`
- [ ] `.gitignore`
- [ ] **NOT**: `.env.local` or any files with real secrets

### Files to Ignore (Never Commit)
- [x] `.env.local` (add to `.gitignore`)
- [x] `node_modules/`
- [x] `.next/` (build output)
- [x] Local build artifacts

---

## Deployment Steps

### 1. Push to Repository
```bash
git add .
git commit -m "Preparation for production deployment"
git push origin main
```

### 2. Deploy to Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Set framework preset: **Next.js**
- [ ] Add environment variables from `.env.example`
- [ ] Click "Deploy"
- [ ] Wait for build to complete

### 3. Configure Cloudflare DNS
- [ ] Log in to Cloudflare Dashboard
- [ ] Go to your domain settings
- [ ] Add records:
  - `@` → Vercel URL (e.g., `dashop.vercel.app`) → CNAME
  - `www` → Vercel URL → CNAME
  - `admin` → Vercel URL → CNAME

### 4. SSL/TLS Settings
- [ ] Cloudflare SSL Mode: **Full (strict)**
- [ ] Let Vercel manage certificates

### 5. Cloudflare Cache Rules
- [ ] Create cache rule for `/cart/*` → Bypass cache
- [ ] Create cache rule for `/checkout/*` → Bypass cache
- [ ] Create cache rule for `/api/*` → Bypass cache
- [ ] Set default cache TTL: 1 hour

### 6. Verify Deployment
- [ ] Homepage loads at `https://yourdomain.com`
- [ ] All product pages load correctly
- [ ] Cart works (add/remove items)
- [ ] Checkout page functional
- [ ] Admin login works (`/login`)
- [ ] Admin dashboard accessible
- [ ] Mobile responsive check

---

## Post-Deployment Tasks

### 1. Update Supabase Environment Variables
Verify in Supabase Dashboard:
- [ ] API keys match production `.env`
- [ ] Service role key is correct for admin operations

### 2. Test Production Flow
As a customer:
- [ ] Browse products
- [ ] Add items to cart
- [ ] Checkout process works
- [ ] Order confirmation email (if configured)

As admin:
- [ ] Login works
- [ ] Product management functional
- [ ] Order management works
- [ ] Analytics dashboard shows data
- [ ] Settings can be updated

### 3. Configure Domain Email (Optional)
For order confirmation emails:
- [ ] Set up DNS records in Cloudflare:
  - `mail.yourdomain.com` → MX record for email provider
  - SPF record: `v=spf1 include:_spf.google.com ~all`
  - DKIM record for authentication

### 4. Set Up Monitoring
- [ ] Enable Vercel Analytics
- [ ] Consider adding Sentry for error tracking
- [ ] Set up Supabase billing alerts
- [ ] Monitor Cloudflare bandwidth usage

---

## Common Post-Deployment Issues

### Issue: "Cannot read properties of undefined"
**Fix**: Clear browser cache, verify Supabase connection

### Issue: Products not loading
**Fix**: Check Supabase RLS policies allow public reads

### Issue: Cart not persisting
**Fix**: Verify `cart_sessions` table exists and has proper policies

### Issue: Admin panel 404
**Fix**: Ensure admin user exists and is authenticated

---

## Production Environment Variables

Add these to Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Optional - Email notifications
RESEND_API_KEY=re_xxxxxxxxxxxxxxx

# Optional - Payment processing
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxx

# Optional - PayPal
PAYPAL_CLIENT_ID=your-paypal-client-id
```

---

## Performance Optimization

### After First Week of Live Traffic:

- [ ] Review Vercel analytics for performance bottlenecks
- [ ] Check database query performance in Supabase
- [ ] Optimize image sizes (compress before upload)
- [ ] Update cache TTLs based on actual usage
- [ ] Consider upgrading Supabase tier if needed

---

## Security Checklist

After deployment:
- [x] Changed admin password from default
- [ ] Enabled 2FA on Supabase account
- [ ] Reviewed all API keys in Vercel
- [ ] Set up Cloudflare WAF rules
- [ ] Configured bot protection in Cloudflare
- [ ] Regular security audits scheduled

---

## Maintenance Schedule

### Weekly:
- Check order notifications working
- Review low-stock alerts
- Monitor error logs

### Monthly:
- Backup database (Supabase auto-backup enabled)
- Review analytics for trends
- Update product images/prices as needed
- Clear old analytics events if needed

---

## Support Contacts

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Cloudflare Support**: [support.cloudflare.com](https://support.cloudflare.com)

---

**🎉 Deployment Checklist Complete!**

Your dashop store is now live and ready for customers! 🚀
