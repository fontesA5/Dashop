# Admin Account Quick Setup (Step-by-Step)

This guide shows you how to create your admin account in 3 minutes using the Supabase Dashboard.

---

## Create Your Admin Account

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on your **dashop** project

### Step 2: Navigate to Authentication → Users

1. In the left sidebar, click **"Authentication"**
2. Click the **"Users"** tab (top of the page)

### Step 3: Add New User

1. Click the **"+ Add user"** button (top right)
2. Fill in the form:
   - **Email**: `admin@dashop.com` (or your preferred email)
   - **Password**: Click "Generate password" or create a strong one
3. Click **"Add user"**

### Step 4: Set Your Own Email (Recommended)

**After creating the account:**

1. Find your new user in the list
2. Click the three dots `...` next to your email
3. Select **"Update attributes"**
4. Change email to your own (e.g., `yourname@example.com`)
5. Click **"Update"**

### Step 5: Set a Secure Password

1. Click the three dots `...` next to your user again
2. Select **"Reset password"**
3. Enter a strong password (use capital letters, numbers, symbols)
4. Click **"Save"**

### Step 6: Login to Admin Dashboard

1. Open your browser and go to:  
   **http://localhost:3000/login** (or your production URL)
2. Enter your admin email and password
3. You'll be redirected to the **Admin Dashboard** 🎉

---

## Done! ✅

You now have full access to:
- Manage products and inventory
- View orders and customer data  
- Check analytics and sales metrics
- Configure store settings

---

## Admin Panel URLs

Once logged in, you can navigate to:

| Page | Description |
|------|-------------|
| [/admin/dashboard](http://localhost:3000/admin/dashboard) | Sales overview & visitor stats |
| [/admin/products](http://localhost:3000/admin/products) | Add/Edit/Delete products |
| [/admin/orders](http://localhost:3000/admin/orders) | View all customer orders |
| [/admin/analytics](http://localhost:3000/admin/analytics) | Sales charts & top products |
| [/admin/settings](http://localhost:3000/admin/settings) | Store configuration |

---

## Security Tips

- ✅ Use a strong password (12+ characters with symbols)
- ✅ Change default email to your real address
- ✅ Enable 2FA in Supabase Dashboard → Settings → Account
- ✅ Never share your credentials

---

## Troubleshooting

### "Cannot access /login page"
- Check environment variables are set correctly
- Verify Supabase project URL is correct
- Try clearing browser cache

### "Email not found"
- Check you created the user in Authentication > Users
- Ensure email spelling is correct
- Wait 1-2 minutes for database sync

### "Wrong password"
- Use "Reset password" from Supabase Dashboard
- Or use a password manager to save credentials securely

---

## Next Steps After Setup

1. ✅ Add initial products via `/admin/products`
2. ✅ Configure store settings (`/admin/settings`)  
3. ✅ Upload product images
4. ✅ Test checkout process
5. ✅ Verify email notifications work

---

**🎉 Your admin account is ready! Start building your store!**
