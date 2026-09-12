# Admin Account Setup Guide

Follow these steps to create your admin account for dashop.

---

## Method 1: Using Supabase Dashboard (Recommended & Easiest)

### Step 1: Go to Supabase Dashboard
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your dashop project

### Step 2: Create Admin User
1. Click **"Authentication"** in the left sidebar
2. Click **"Users"** tab
3. Click **"+ Add user"** button
4. Fill in:
   - **Email**: `admin@example.com` (or your preferred admin email)
   - **Password**: Click "Generate password" or create a strong one
5. Click **"Add user"**

### Step 3: Set Admin Role (Automatic!)
✅ **Done!** Your new user automatically has:
- Full admin access to the dashboard
- Ability to manage products, orders, settings
- Owner-level permissions in Supabase

**Note**: You don't need to manually set a "role" field. Supabase handles this automatically.

---

## Method 2: Via SQL Editor (Advanced)

If you want to customize admin metadata via SQL:

### Step 1: Create User First
```sql
-- Add a new user (must be done before updating)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, created_at, updated_at, raw_user_meta_data, raw_user_attributes)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- instance_id (any UUID works)
  gen_random_uuid(),                       -- user ID
  'authenticated',                         -- aud (audience)
  'authenticated',                         -- role
  'admin@example.com',                     -- email
  -- encrypted_password (use bcrypt to hash your password)
  crypt('your_secure_password$,pbkdf2-sha256$6$rounds=4096$', salt_random()),
  NOW(),                                  -- created_at
  NOW(),                                  -- updated_at
  '{"role": "admin"}'::jsonb,             -- raw_user_meta_data (optional)
  '{}'::jsonb                             -- raw_user_attributes
);
```

**⚠️ Important**: The password needs to be hashed properly. Easiest way is through the Dashboard UI above.

---

## After Creating Your Admin Account

### First Login
1. Go to: `http://localhost:3000/login` (local) or your production URL
2. Enter your admin email and password
3. You'll be redirected to `/admin/dashboard`

### Default Credentials (Change Immediately!)
```
Email: admin@example.com
Password: [set during creation]
```

**Security Best Practice**: Change this to your own email address after first login!

---

## Admin Dashboard Access

Once logged in, you can access:

| Page | URL Pattern | Description |
|------|-------------|-------------|
| Dashboard | `/admin/dashboard` | Analytics overview |
| Products | `/admin/products` | Product management |
| Orders | `/admin/orders` | Order tracking |
| Analytics | `/admin/analytics` | Detailed metrics |
| Settings | `/admin/settings` | Store configuration |

---

## Troubleshooting Admin Access

### Problem: "Cannot access admin pages"
**Solutions**:
1. ✅ Check you're logged in (click your email/name in top right)
2. ✅ Verify Row Level Security policies in Supabase Dashboard
3. ✅ Clear browser cache and try again
4. ✅ Try incognito/private browsing mode

### Problem: "Sign in with Supabase" button not working
**Solutions**:
1. Check environment variables are set correctly
2. Verify Supabase project URL is correct
3. Ensure API keys are valid

---

## Optional: Add Admin Badge to Dashboard

To visually identify admin users, you can add a role badge:

### In Supabase Dashboard > Authentication > Users:
1. Click the three dots (...) next to your admin user
2. Select "Update user attributes"
3. Add: `"role": "admin"`
4. Save

Then in admin layout (`app/(admin)/layout.tsx`), check for this attribute to show admin indicators.

---

## Security Checklist

After setting up admin access:

- [ ] Changed default password
- [ ] Using your own email (not `admin@example.com`)
- [ ] Enabled 2FA on Supabase account (Settings > Account)
- [ ] Reviewed RLS policies to ensure proper access control
- [ ] Added admin user to trusted devices only

---

## Next Steps

After admin setup is complete:

1. ✅ Browse products and add initial inventory
2. ✅ Configure store settings (shipping, tax, branding)
3. ✅ Add product images via admin panel
4. ✅ Test checkout process with a sample order
5. ✅ Verify email notifications work (if configured)
6. ✅ Review analytics dashboard metrics

---

## Need Help?

If you encounter any issues:

1. **Check Supabase Dashboard** for error messages
2. **Review RLS policies** in Database > Row Level Security
3. **Inspect browser console** (F12 → Console tab) for JavaScript errors
4. **Test with incognito mode** to rule out caching issues

---

**🎉 Your admin account is ready! Start managing your store!**
