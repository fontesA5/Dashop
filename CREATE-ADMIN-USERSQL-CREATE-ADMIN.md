# Create Admin User - Simple Steps

## Quick 2-Minute Setup

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **dashop** project
3. Click **"SQL Editor"** in sidebar
4. Click **"New query"**

### Step 2: Copy & Paste This Entire Block
```sql
-- Disable RLS temporarily for user creation
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Create admin user
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

-- Confirm email for immediate login
UPDATE auth.users SET email_confirm = true WHERE email = 'admin@dashop.com';

-- Create matching profile table entry
INSERT INTO profiles (id, email) 
SELECT id, email FROM auth.users WHERE email = 'admin@dashop.com';

-- Re-enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Verify success
SELECT email, raw_user_meta_data FROM auth.users WHERE email = 'admin@dashop.com';
```

### Step 3: Click "Run" Button (Top of Screen)
- ✅ You should see output showing the user was created
- ✅ If you see error messages, let me know which one!

### Step 4: Set a Password (via Dashboard UI)
1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Find your admin user (`admin@dashop.com`)
3. Click the three dots `...` next to it
4. Select **"Reset password"**
5. Enter a strong password (e.g., `SecureP@ssw0rd!`)
6. Save

### Step 5: Test Your Admin Account
```bash
npm run dev
# Visit in browser: http://localhost:3000/login
# Enter:
# Email: admin@dashop.com
# Password: (use what you set above)
```

---

## Expected Output (Success!)

After clicking "Run", you should see:
```
id | email            | raw_user_meta_data  
----+------------------+--------------------
uuid| admin@dashop.com | {"role":"admin"}
(1 row)
```

✅ **This means your admin user is created successfully!**

---

## If You Get an Error

### Error: "ERROR: 42501: permission denied"
**Fix:** Run this first in SQL Editor:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
```

### Error: "ERROR: 42703: column does not exist"
**Fix:** Your Supabase version might be newer. Try this simpler command:
```sql
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
INSERT INTO auth.users (email, raw_user_meta_data, created_at, updated_at) 
VALUES ('admin@dashop.com', '{}'::jsonb, now(), now());
UPDATE auth.users SET email_confirm = true WHERE email = 'admin@dashop.com';
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
INSERT INTO profiles (id, email) SELECT id, email FROM auth.users WHERE email = 'admin@dashop.com';
```

### Error: "ERROR: 23503: constraint violation"
**Fix:** You may have a user with that email already. Delete it first:
```sql
DELETE FROM auth.users WHERE email = 'admin@dashop.com';
-- Then run the original creation commands again
```

---

## Troubleshooting Login Issues

### Issue: Can't login - "Invalid credentials"
**Solution:** Your password needs to be set via Dashboard UI (see Step 4 above)

### Issue: "Email not found"  
**Solution:** Run this verification query first:
```sql
SELECT email, created_at FROM auth.users;
```

### Issue: Still getting errors after all this
**Solution:** 
1. Check your Supabase project settings → Database → Row Level Security
2. Make sure there are no custom RLS policies blocking user creation
3. Try recreating the project from scratch if needed

---

## After Creating Admin User

Your admin dashboard is ready at:
- Local: `http://localhost:3000/login`
- Production: `[your-domain]/login`

Default login credentials:
- **Email**: `admin@dashop.com`
- **Password**: [set via Dashboard UI in Step 4]

---

**🎉 You're all set! Proceed with adding products and managing your store.**
