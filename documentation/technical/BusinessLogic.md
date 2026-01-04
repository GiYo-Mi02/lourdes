# Business Logic & Workflows

## Step-based flow (current)

The app uses a numeric `step` state in `App.tsx`:
- 0: Welcome
- 1: Personal info
- 2: Contact info
- 3: Vitals briefing
- 4..N: Vital measurement screens (based on settings)
- Review
- Success
- 99: Assistance requested

## Record persistence

- Data is held in React state until the Success screen.
- On Success screen mount: `savePatientRecord(data)` runs once.

## Offline-first logic (current)

- Records are written immediately to `localStorage`.
- If Supabase is configured, the app attempts to insert into Supabase.
- If the insert fails, record remains local.

## Admin queue updates

- Admin Dashboard loads patients and polls every 30s.
- Status updates call `updatePatientStatus(id, status)`.

## Vital measurement (prototype)

- Measurements are simulated over time.
- There is an intentional “failure rate” to test retry flows.
- A “status” (Normal/Warning/Critical) is computed from the measurement.

## Specific correctness issue (important)

- Temperature unit shown in the UI config is **°F**.
- The analysis thresholds in `vitalAnalysisService.ts` were initially defined using **°C ranges**.

If left unfixed, this causes:
- a temperature like `98.6` (°F) to be interpreted as 98.6°C → marked Critical.

Fix direction:
- Ensure thresholds are defined in the same unit the UI displays/collects.

## Assistance request

- “Assistance Requested” is currently UI-only.
- There is no backend event, staff notification, or persistence.

Production direction:
- Create a `assistance_requests` table and insert a row with kiosk ID + timestamp.
- Optionally broadcast via Supabase Realtime to a staff dashboard.
