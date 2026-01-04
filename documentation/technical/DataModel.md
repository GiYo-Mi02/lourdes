# Data Model & Database (Supabase)

## In-app TypeScript model

Primary types are defined in `types.ts`:
- `PatientData` (UI collection payload)
- `PatientRecord` (persisted record)
- `VitalMeasurement` (value + unit + status + timestamp)

See UML: [UML.md](UML.md)

## Supabase database schema

A proposed schema is provided in `supabase_schema.sql`.

### Table: `public.patients`
Recommended columns:
- `id` (uuid, primary key)
- `first_name`, `last_name`
- `dob` (date)
- contact fields (phone, address fields)
- guardian fields (optional)
- `vitals` (jsonb)
- `check_in_time` (timestamptz)
- `status` (text enum-like check)

## Critical mismatch to fix (specific)

Right now the UI collects `dob` as a string formatted `MM/DD/YYYY`.
But the SQL schema defines `dob` as a Postgres `date`.

This will fail inserts unless you:
- store `dob` as text in the database, OR
- convert `MM/DD/YYYY` to an ISO date (`YYYY-MM-DD`) before insert, OR
- collect DOB as an ISO date in the UI.

## RLS policy warning (very important)

The current `supabase_schema.sql` includes prototype policies allowing anonymous `select` and `update` for convenience.
That is **not acceptable** for any real PHI.

Production direction:
- `anon` should typically only be allowed to `insert`.
- Staff access must be `authenticated` (Supabase Auth) with strict policies.

## Suggested production model (direction)

- `patients` table stores demographics + queue status
- `patient_vitals` table stores each vital measurement as a row (not jsonb), to enable analytics and history
- `audit_log` table for admin actions (status changes, data access)

That normalization is not required for the current prototype, but it is a realistic next step.
