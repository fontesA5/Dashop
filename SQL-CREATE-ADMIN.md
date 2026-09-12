# SQL Commands to Create Admin User

Follow these exact steps to create your admin account using SQL.

---

## Step 1: Go to Supabase SQL Editor

1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **dashop** project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**

---

## Step 2: Run These Commands (Copy & Paste All)

```sql
-- =============================================
-- STEP 1: DISABLE RLS FOR USER CREATION
-- =============================================

-- Turn off Row Level Security temporarily
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 2: CREATE ADMIN USER
-- =============================================

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, created_at, updated_at, raw_user_meta_data, raw_user_attributes) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@dashop.com',
  crypt('AdminDashop2024!', salt_random()),
  now(),
  now(),
  '{"role": "admin"}'::jsonb,
  '{}'::jsonb
);

-- =============================================
-- STEP 3: ENABLE RLS BACK
-- =============================================

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 4: CREATE PROFILE FOR USER
-- =============================================

-- This creates the profile that matches our profiles table
INSERT INTO profiles (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@dashop.com';

-- =============================================
-- STEP 5: VERIFY USER WAS CREATED
-- =============================================

SELECT id, email, created_at, raw_user_meta_data 
FROM auth.users 
WHERE email = 'admin@dashop.com';
```

---

## Step 3: Check Results

After running the commands, you should see output like:

```
id | email            | created_at   | raw_user_meta_data  
----+------------------+--------------+----------------------
uuid| admin@dashop.com | 2024-xx-xx xx| {"role": "admin"}
(1 row)
```

✅ **Success!** User was created.

---

## Alternative: Simpler Method (If Above Fails)

### Option A: Create Email-Only User First

If the above fails due to security restrictions, run this instead:

```sql
-- Disable RLS
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Create email-only user (no password yet)
INSERT INTO auth.users (email, raw_user_meta_data, created_at, updated_at) 
VALUES ('admin@dashop.com', '{"role": "admin"}'::jsonb, now(), now());

-- Re-enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Verify user exists
SELECT email, raw_user_meta_data FROM auth.users WHERE email = 'admin@dashop.com';
```

Then go to **Authentication > Users** in Supabase Dashboard and click "Reset password" for this email.

### Option B: Create via Auth Table (Recommended)

Sometimes the simplest approach works best:

```sql
-- Disable RLS
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Insert user without password field
INSERT INTO auth.users (instance_id, id, aud, role, email, created_at, updated_at, raw_user_meta_data, raw_user_attributes) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@dashop.com',
  now(),
  now(),
  '{"role": "admin"}'::jsonb,
  '{}'::jsonb
);

-- Re-enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
```

---

## Step 4: Create/Reset Password

After user is created (either via SQL or above), you have two options:

### Option A: Via Supabase Dashboard (Easiest)

1. Go to **Authentication > Users** in Supabase Dashboard
2. Find your admin user (`admin@dashop.com`)
3. Click three dots `...` → **"Reset password"**
4. Enter a new strong password (e.g., `SecureP@ssw0rd!`)
5. Save

### Option B: Via SQL

```sql
-- Update user with bcrypt-hashed password
UPDATE auth.users 
SET raw_user_attributes = jsonb_set(
  raw_user_attributes || '{"password_hash": ...}', 
  '{hash}',
  crypt('YourNewPassword123!', salt_random())
)
WHERE email = 'admin@dashop.com';
```

**⚠️ Note:** You need to hash passwords properly. Option A is easier!

---

## Step 5: Test Your Admin Account

1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:3000/login`
3. Enter:
   - Email: `admin@dashop.com`
   - Password: `AdminDashop2024!` (or what you set)
4. Click "Sign in"

✅ You should see the admin dashboard!

---

## Troubleshooting Common Issues

### Issue: "ERROR: 42501: permission denied for table auth.users"

**Solution:**
The `auth.users` table is protected by Supabase security. If you get this error, try the simpler method below:

```sql
-- Try inserting into a different auth schema
INSERT INTO public.auth.users (email, raw_user_meta_data, created_at, updated_at) 
VALUES ('admin@dashop.com', '{"role": "admin"}'::jsonb, now(), now());
```

### Issue: "ERROR: 42703: column does not exist"

**Solution:**
The `auth.users` table schema has changed in newer Supabase versions. Try this simplified version:

```sql
-- Disable RLS first
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Create user with only required fields
INSERT INTO auth.users (email, raw_user_meta_data, created_at, updated_at) 
VALUES ('admin@dashop.com', '{}'::jsonb, now(), now());

-- Enable RLS back
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
```

### Issue: User appears but login doesn't work

**Solution:**
Email confirmation is required. Fix with:

```sql
-- Confirm email address
UPDATE auth.users SET email_confirm = true WHERE email = 'admin@dashop.com';

-- Also confirm invitation if exists
UPDATE auth.users SET invite_sent = false, invitation = null 
WHERE email = 'admin@dashop.com';
```

### Issue: "401 Unauthorized" when trying to login

**Solution:**
Your account may not have an `id` set. Try regenerating it:

```sql
-- Delete and recreate with proper ID
DELETE FROM auth.users WHERE email = 'admin@dashop.com';

INSERT INTO auth.users (instance_id, id, aud, role, email, created_at, updated_at) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), -- Generate new UUID
  'authenticated',
  'authenticated',
  'admin@dashop.com',
  now(),
  now()
);
```

---

## Step-by-Step Quick Command (Copy & Paste All)

If you want to try everything at once, run this complete script:

```sql
-- =============================================
-- COMPLETE ADMIN USER CREATION SCRIPT
-- =============================================

-- 1. Disable RLS for user creation
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- 2. Delete existing admin user if exists (to avoid conflicts)
DELETE FROM auth.users WHERE email = 'admin@dashop.com';

-- 3. Create new admin user
INSERT INTO auth.users (instance_id, id, aud, role, email, created_at, updated_at, raw_user_meta_data, raw_user_attributes) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@dashop.com',
  now(),
  now(),
  '{"role": "admin"}'::jsonb,
  '{}'::jsonb
);

-- 4. Create profile in profiles table
INSERT INTO profiles (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@dashop.com';

-- 5. Confirm email address
UPDATE auth.users SET email_confirm = true 
WHERE email = 'admin@dashop.com';

-- 6. Remove invitation if exists
UPDATE auth.users SET invite_sent = false, invitation = null 
WHERE email = 'admin@dashop.com';

-- 7. Re-enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- 8. Verify user was created successfully
SELECT id, email, created_at, raw_user_meta_data, raw_user_attributes 
FROM auth.users 
WHERE email = 'admin@dashop.com';

-- Output: Should show 1 row with your admin user
```

---

## After Creating Admin User

### Set a Secure Password (Optional but Recommended)

Go to Supabase Dashboard → Authentication → Users → Click on your admin user → "Reset password" and create a strong password.

### Test Your Account

```bash
# In terminal:
npm run dev

# Open browser and go to:
http://localhost:3000/login

# Enter:
# Email: admin@dashop.com
# Password: (use what you set in Dashboard or try "AdminDashop2024!")
```

---

## Still Not Working? Try This Nuclear Option

If nothing else works, run this to completely reset auth users table:

```sql
-- WARNING: Deletes ALL users from your project!
-- ONLY RUN IF YOU HAVE NO IMPORTANT DATA

DELETE FROM profiles;
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
DELETE FROM auth.users;
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Now create fresh admin user
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

-- Confirm email
UPDATE auth.users SET email_confirm = true WHERE email = 'admin@dashop.com';

-- Create profile
INSERT INTO profiles (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@dashop.com';
```

---

## Final Notes

✅ **Use the SQL commands in `schema.sql`** after running the database schema first.

✅ **Try Method 1 (with crypt)** first, then try simpler methods if it fails.

✅ **Always check your results** after each command to see what's happening.

✅ **If all else fails**, use the Dashboard UI to reset/create the user.

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY` | Temporarily disable security |
| `INSERT INTO auth.users (...)` | Create new user |
| `ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY` | Re-enable security |
| `UPDATE auth.users SET email_confirm = true` | Allow login without confirmation |

---

**🎉 After running these SQL commands, you can login and access your admin dashboard!**
