# Security & Privacy

## Threat model (specific to this kiosk)

- Anyone physically present may attempt to access admin mode.
- Data entered may constitute PHI depending on jurisdiction and policy.
- Network attackers could attempt to read/write Supabase data if RLS is permissive.

## Current state (prototype) — specific findings

1) Admin access
- Admin entry point is visible on the Welcome screen.
- PIN is hardcoded in the client.
- This is a deterrent, not security. Anyone can inspect the bundle.

2) Browser storage
- Patient records are stored in `localStorage` as plaintext JSON.
- Any user with access to the kiosk browser profile can extract records.

3) Supabase policies
- If `anon` is allowed to `select`/`update` patients, **anyone** with the anon key can read/modify PHI.
- The anon key is not a secret; it must be treated as public.

4) Logging & error handling
- Errors are logged to console.
- No monitoring/alerting.

## Minimum production requirements (practical)

- Replace PIN with Supabase Auth for staff (or a kiosk-managed local auth with secure OS lockdown).
- RLS:
  - Allow `anon` only `insert` (and even that should be minimally scoped).
  - Allow `authenticated` `select/update`.
- Remove or encrypt local storage:
  - Preferred: don’t store PHI offline, or store only a queue token.
  - If offline storage is required, encrypt at rest using a device-managed key.
- Add audit logs for all admin actions.

## Privacy UX recommendations

- Add explicit consent / notice screen describing what data is collected and why.
- Add clear “cancel and delete” behavior.
- Add data retention policy and implement auto-expiration.

## Kiosk hardening (operational)

- Use OS kiosk mode.
- Disable devtools / limit navigation.
- Clear browser state on schedule.
