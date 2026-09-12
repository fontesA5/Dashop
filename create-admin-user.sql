-- =============================================
-- CREATE ADMIN USER FOR DASHOP STORE
-- =============================================
-- Run these commands in Supabase SQL Editor to create your admin account
-- 
-- Instructions:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your dashop project
-- 3. Click "SQL Editor" in left sidebar
-- 4. Click "New query"
-- 5. Copy ALL the SQL below and paste into the editor
-- 6. Click "Run" button at top
-- =============================================

-- STEP 1: Disable Row Level Security temporarily for user creation
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- STEP 2: Create admin user with email and metadata
INSERT INTO auth.users (instance_id, id, aud, role, email, raw_user_meta_data, created_at, updated_at) 
VALUES (
  '00000000-0000-0000-0000-000000000000', -- instance_id (any UUID works)
  gen_random_uuid(),                       -- unique user ID
  'authenticated',                         -- audience type
  'authenticated',                         -- role in auth system
  'admin@dashop.com',                      -- admin email address
  '{"role": "admin"}'::jsonb,              -- metadata with admin role
  now(),                                   -- created timestamp
  now()                                    -- updated timestamp
);

-- STEP 3: Confirm email so user can login immediately without email verification
UPDATE auth.users SET email_confirm = true WHERE email = 'admin@dashop.com';

-- STEP 4: Create matching entry in profiles table (required by our app)
INSERT INTO profiles (id, email) 
SELECT id, email FROM auth.users WHERE email = 'admin@dashop.com';

-- STEP 5: Re-enable Row Level Security for security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- STEP 6: Verify the user was created successfully
SELECT 
  email AS "Email",
  raw_user_meta_data AS "User Metadata",
  email_confirm AS "Email Confirmed",
  created_at AS "Created"
FROM auth.users 
WHERE email = 'admin@dashop.com';

-- =============================================
-- AFTER USER IS CREATED:
-- =============================================
-- 
-- To set a password for login, do this in Supabase Dashboard:
-- 1. Go to Authentication → Users tab
-- 2. Find your admin user (admin@dashop.com)
-- 3. Click the three dots (...) next to it
-- 4. Select "Reset password"
-- 5. Enter a strong password and save
-- 
-- Then login at: http://localhost:3000/login
-- Email: admin@dashop.com
-- Password: (use what you set above)
