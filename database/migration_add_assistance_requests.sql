-- Migration: Add Assistance Requests System
-- Run this after the initial patients table has been created

-- Create the assistance_requests table for kiosk help requests
create table if not exists public.assistance_requests (
  id text primary key,
  kiosk_id text not null,
  timestamp timestamptz default now(),
  status text default 'pending' check (status in ('pending', 'acknowledged', 'resolved')),
  resolved_at timestamptz,
  resolved_by text
);

-- Enable Row Level Security on assistance_requests
alter table public.assistance_requests enable row level security;

-- Assistance Requests Policies (for prototype - allow anon access)
create policy "Allow anon insert assistance"
on public.assistance_requests
for insert
to anon
with check (true);

create policy "Allow anon select assistance"
on public.assistance_requests
for select
to anon
using (true);

create policy "Allow anon update assistance"
on public.assistance_requests
for update
to anon
using (true);

-- Optional: Update patients table id column to TEXT if it's currently UUID
-- IMPORTANT: Only run this if your patients table still uses UUID type
-- WARNING: This will fail if you have existing data. Backup first!
-- Uncomment the lines below ONLY if needed:

-- alter table public.patients alter column id type text;
