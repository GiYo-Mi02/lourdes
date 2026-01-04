# Operations Runbook

## Day-0 checklist (before installing in a hospital)

- Configure OS-level kiosk mode (single-app, auto-launch browser).
- Disable system notifications and OS popups.
- Ensure time sync (NTP) is enabled.
- Configure network (preferred: wired).
- Configure Supabase environment variables.
- Validate admin access procedure.

## Daily operations

- Verify kiosk is online (or confirm offline-first behavior is acceptable).
- Verify admin dashboard loads patient queue.
- Clear printer queue (if receipt printing is enabled in the future).

## Data lifecycle

- Current: records persist in `localStorage` until cleared.
- Recommendation: scheduled purge (e.g., daily) and server-side retention.

## Incident response (prototype)

If the kiosk crashes:
- The app shows a “System Error” screen with a restart button.
- Restart by reloading the browser.

If network is down:
- Check-ins should still work (local storage).
- Records may not appear in Supabase until connectivity returns.

## Monitoring (missing)

Production needs:
- client-side error reporting (Sentry/Datadog)
- availability checks
- admin audit logs
