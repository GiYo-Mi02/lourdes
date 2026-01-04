# QA / Testing Strategy

## What to test (specific)

### Critical path (patient)
- Step progression: Welcome → Personal → Contact → Vitals → Review → Success
- Validation:
  - required fields
  - DOB format and age constraints (currently missing)
  - phone formatting / length
- Retry behavior in vital measurements (simulated failures)
- Save-once logic in Success screen

### Admin path
- PIN gate
- Patient list loads
- Status updates persist
- Clear records behavior

### Offline mode
- Disable network, complete check-in, verify record stored locally
- Re-enable network, verify pending sync

## Automation recommendation

- Add unit tests for:
  - vital analysis (`analyzeVital`)
  - DOB parsing/validation
  - record mapping (UI → DB)

- Add E2E tests using Playwright:
  - complete check-in
  - admin status updates

## Current test status

- No test suite exists in the repository yet.
