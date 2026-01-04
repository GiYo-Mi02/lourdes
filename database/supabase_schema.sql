-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the patients table
create table public.patients (
  id uuid default uuid_generate_v4() primary key,
  first_name text not null,
  last_name text not null,
  dob date not null,
  gender text not null,
  civil_status text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip_code text,
  guardian_name text,
  guardian_phone text,
  vitals jsonb default '{}'::jsonb,
  check_in_time timestamptz default now(),
  status text default 'Waiting' check (status in ('Waiting', 'In Progress', 'Completed', 'Assistance Needed', 'Cancelled'))
);

-- Enable Row Level Security (RLS)
alter table public.patients enable row level security;

-- Create a policy that allows anonymous inserts (for the kiosk)
create policy "Allow anonymous inserts"
on public.patients
for insert
to anon
with check (true);

-- Create a policy that allows authenticated users (admins) to view all records
create policy "Allow authenticated view"
on public.patients
for select
to authenticated
using (true);

-- Create a policy that allows authenticated users (admins) to update records
create policy "Allow authenticated update"
on public.patients
for update
to authenticated
using (true);

-- Create a policy for anonymous users to read their own created record (optional, usually not needed for kiosk if they don't log in, but good for immediate confirmation if we return the ID)
-- For a pure kiosk, we might just allow anon select for now if we don't have auth set up, OR restrict it completely and only allow the kiosk to INSERT.
-- Let's allow anon select for now to make the "Admin Dashboard" work in this prototype phase without full auth setup, 
-- BUT in production, you would restrict this to only authenticated staff.
create policy "Allow anon select for prototype"
on public.patients
for select
to anon
using (true);

-- Create a policy for anon update (for status updates in prototype)
create policy "Allow anon update for prototype"
on public.patients
for update
to anon
using (true);
