-- Quick Verification Script for Supabase
-- Run this in Supabase SQL Editor to check your setup

-- 1. Check if patients table exists and has correct structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'patients'
ORDER BY ordinal_position;

-- 2. Check if assistance_requests table exists
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'assistance_requests'
ORDER BY ordinal_position;

-- 3. Check if real-time is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('patients', 'assistance_requests');

-- 4. Check RLS policies
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('patients', 'assistance_requests');

-- 5. Count existing records
SELECT 
  'patients' as table_name,
  COUNT(*) as record_count
FROM patients
UNION ALL
SELECT 
  'assistance_requests' as table_name,
  COUNT(*) as record_count
FROM assistance_requests;

-- Expected Output:
-- If you see "relation does not exist" errors, run the schema setup scripts
-- If RLS shows 'true' but no policies, you need to add the policies
-- If real-time doesn't work, check Database → Replication in Supabase Dashboard
