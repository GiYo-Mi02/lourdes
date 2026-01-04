# Executive Summary

## What this system is

The Lourdes Patient Intake Kiosk is a web-based kiosk application that guides patients through:
- Personal information entry
- Contact and (optional) guardian details
- Vital signs collection (currently **simulated**)
- Review + submission

It includes a staff-facing Admin Dashboard for viewing and updating patient intake queue status.

## What it is today (January 2026)

- A polished **prototype** with an end-to-end UI flow.
- Data storage is **offline-first** via browser `localStorage` and can optionally sync to Supabase if configured.
- Vital signs are **not connected** to real hardware; values and waveforms are generated in software.

## Who it’s for

- Patients: self-service check-in.
- Front desk / nursing staff: view the intake queue, mark statuses, and manage basic kiosk settings.

## Key outcomes

- Reduced manual data entry at the front desk.
- Faster initial triage when vital signs are integrated.
- More consistent intake data structure.

## Major constraints & risks (important)

- **Privacy risk**: As currently configured for prototyping, the database security policies can allow anonymous users to read/update all patient data.
- **Not HIPAA/PHI-ready by default**: data is stored unencrypted in the browser and may be accessible to anyone with kiosk access.
- **Vitals are simulated**: numeric values should not be used clinically.

## Recommendation

Treat the current system as a UX prototype and technical foundation.
To become production-ready, prioritize (in order):
1) Data privacy & access control, 2) operational hardening (offline sync, error handling, monitoring), 3) audit logging and retention rules, and only then 4) hardware integration.
