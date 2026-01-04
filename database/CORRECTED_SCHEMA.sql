-- CORRECTED SUPABASE SCHEMA FOR LOURDES HOSPITAL KIOSK
-- Run this in Supabase SQL Editor to fix the 400 and 409 errors
-- This matches the exact structure your code is sending

-- Drop existing tables to recreate with TEXT id (not UUID)
-- This will delete any test data - that's okay, you're testing
DROP TABLE IF EXISTS public.assistance_requests CASCADE;
DROP TABLE IF EXISTS public.patients CASCADE;

-- =============================================================================
-- PATIENTS TABLE (CORRECTED)
-- =============================================================================
CREATE TABLE public.patients (
  id TEXT PRIMARY KEY,  -- Changed from UUID to TEXT for LRD-YYYYMMDD-NNNN format
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  gender TEXT NOT NULL,
  civil_status TEXT,
  phone TEXT,  -- Made nullable since it might be empty
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  vitals JSONB DEFAULT '{}'::JSONB,
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Waiting' CHECK (status IN ('Waiting', 'In Progress', 'Completed', 'Assistance Needed', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ASSISTANCE REQUESTS TABLE (NEW)
-- =============================================================================
CREATE TABLE public.assistance_requests (
  id TEXT PRIMARY KEY,
  kiosk_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'resolved')),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistance_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated view" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.patients;
DROP POLICY IF EXISTS "Allow anon select for prototype" ON public.patients;
DROP POLICY IF EXISTS "Allow anon update for prototype" ON public.patients;
DROP POLICY IF EXISTS "Allow all operations on patients" ON public.patients;
DROP POLICY IF EXISTS "Allow all operations on assistance_requests" ON public.assistance_requests;

-- Patients table policies (permissive for prototype/testing)
CREATE POLICY "Allow all operations on patients" 
ON public.patients 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Assistance requests policies (permissive for prototype/testing)
CREATE POLICY "Allow all operations on assistance_requests" 
ON public.assistance_requests 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- =============================================================================
-- REAL-TIME NOTE
-- =============================================================================
-- Real-time replication is in ALPHA and may not be available on all plans.
-- This system uses polling-based updates (refreshes every 5 seconds) as an alternative.
-- No additional setup required - polling is automatic!

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Run these to verify setup:

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('patients', 'assistance_requests')
ORDER BY table_name, ordinal_position;

-- Check RLS policies
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('patients', 'assistance_requests');

-- Count records
SELECT 
  'patients' as table_name,
  COUNT(*) as record_count
FROM public.patients
UNION ALL
SELECT 
  'assistance_requests' as table_name,
  COUNT(*) as record_count
FROM public.assistance_requests;

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Schema setup complete!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Refresh your application (Ctrl+Shift+R)';
  RAISE NOTICE '2. Run testDB.connection() in console';
  RAISE NOTICE '3. System will auto-refresh every 5 seconds';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: Using polling mode (no real-time replication needed)';
END $$;
