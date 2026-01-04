# Brutal Critique & Specific Improvements

This section is intentionally direct. The UI is strong, but the system is not production-ready for medical intake without substantial security and data-model work.

## Critical issues (must fix before any real deployment)

### 1) Supabase RLS policies allow anonymous read/update
If `anon` can `select` or `update` `patients`, the system is effectively public.
- Anyone with the anon key (which is not secret) can read all patient records.
- This is the single biggest blocker.

Fix:
- Remove anon `select` and `update` policies.
- Require Supabase Auth for staff. Only allow `authenticated` to read/update.

### 2) Client stores PHI in plaintext localStorage
The kiosk stores full demographic/contact data in browser storage.
- Anyone with physical access (or malware) can extract it.

Fix options:
- Best: do not store PHI offline (store a short token and re-fetch server-side for staff).
- If offline is mandatory: encrypt client-side with a device-managed key and purge aggressively.

### 3) DOB format mismatch with DB schema
UI uses `MM/DD/YYYY` string; DB schema uses Postgres `date`.
- This will fail inserts unless converted.

Fix:
- Convert to ISO (`YYYY-MM-DD`) before insert, or store DOB as text.

### 4) Temperature unit mismatch causes wrong triage status
UI displays temperature in **°F** but analysis thresholds were originally defined in **°C**.
- This will incorrectly mark normal temperatures as Critical.

Fix:
- Make thresholds match the UI unit.

### 5) Admin PIN is hardcoded client-side
Hardcoding a PIN is not security.

Fix:
- Move to Supabase Auth (recommended) or a secure kiosk-managed auth approach.

## High-priority product/engineering gaps

### Assistance request is not real
The “Assistance Requested” screen does not notify staff.

Fix:
- Persist an assistance event (Supabase table) and show it to staff.

### “Print Receipt” button does nothing
It is present in UI but has no functionality.

Fix:
- Implement printing using `window.print()` with a receipt-only stylesheet, or integrate a kiosk printer bridge.

### Address autocomplete is fake
Hardcoded suggestions create the illusion of functionality.

Fix:
- Remove it for honesty, or integrate a real address provider (even a basic local dataset).

### Admin settings do not fully persist
- Vitals toggles persist.
- Hospital name and kiosk identifier are local state only (not persisted or used elsewhere).

Fix:
- Persist settings and use them in Assistance screen, footer, and metadata.

## Engineering improvements (specific)

- Introduce a real data layer boundary:
  - UI types (`PatientData`) should be separate from DB types (snake_case + real types).
- Add idempotency for sync:
  - Currently inserts can duplicate if retry happens after server accepted but client didn’t mark synced.
  - Fix: add a deterministic client_id column and upsert by client_id.
- Add schema validation:
  - Use Zod/Yup for form payload validation and sanitization.
- Add tests:
  - Unit tests for `analyzeVital`, mapping, DOB parsing.
  - E2E for check-in flow.

## What’s actually good

- Clear UX flow and strong UI polish.
- Good separation into screens/components.
- Offline-first posture is directionally correct for kiosks.

## Practical roadmap (ordered)

1) Lock down Supabase RLS + staff auth
2) Fix data-type mismatches and unit correctness
3) Implement assistance event + admin alerts
4) Add audit log + retention
5) Improve offline sync idempotency
6) Add tests + CI
