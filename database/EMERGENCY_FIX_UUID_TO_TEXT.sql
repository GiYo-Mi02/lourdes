-- ⚡ EMERGENCY FIX - Change ID from UUID to TEXT
-- This will fix the "invalid input syntax for type uuid" error
-- Run this in Supabase SQL Editor RIGHT NOW

-- =============================================================================
-- STEP 1: Drop the old table (if you don't need existing data)
-- =============================================================================
-- IMPORTANT: This deletes ALL existing patient data!
-- If you need to keep data, skip to STEP 2

DROP TABLE IF EXISTS public.patients CASCADE;
DROP TABLE IF EXISTS public.assistance_requests CASCADE;

-- =============================================================================
-- STEP 2: Create tables with correct structure (TEXT id, not UUID)
-- =============================================================================

CREATE TABLE public.patients (
  id TEXT PRIMARY KEY,  -- TEXT, not UUID!
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  gender TEXT NOT NULL,
  civil_status TEXT,
  phone TEXT,  -- Nullable
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
-- STEP 3: Enable RLS and set policies
-- =============================================================================

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on patients" 
ON public.patients 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on assistance_requests" 
ON public.assistance_requests 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Check the id column type (should be "text", not "uuid")
SELECT 
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name = 'patients' AND column_name = 'id';

-- If data_type shows "text", you're good to go! ✅
-- If data_type shows "uuid", run this script again.

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Tables recreated with TEXT id!';
  RAISE NOTICE 'Now refresh your browser (Ctrl+Shift+R)';
  RAISE NOTICE 'Then try check-in again - it will work!';
END $$;
