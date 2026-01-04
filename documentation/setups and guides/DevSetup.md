# Developer Setup

## Prerequisites

- Node.js (recent LTS)
- npm

## Install

- `npm install`

## Run

- `npm run dev`

## Build

- `npm run build`

## Environment variables

Create `.env` in the repository root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## Supabase schema

Run `supabase_schema.sql` in Supabase SQL Editor.

## Notes

- This is a Vite app, so only variables prefixed with `VITE_` are exposed to the client.
- The anon key is not secret; security must be enforced by RLS.
