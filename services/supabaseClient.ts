import { createClient } from '@supabase/supabase-js';

// Configuration:
// To enable database storage:
// 1. Create a project at https://supabase.com
// 2. Paste your project URL and ANON API key below
// 3. Create a table named 'patients' with columns matching the PatientRecord interface (jsonb for vitals is easiest)

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if keys are present
export const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;
