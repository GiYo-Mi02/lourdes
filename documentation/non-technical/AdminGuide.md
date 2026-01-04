# Admin Guide (Staff Portal)

## Accessing Admin Mode

- On the Welcome screen, tap **Admin** (bottom-left).
- The Admin Dashboard is protected by a PIN prompt.

## Admin areas

### Patients
- View intake queue
- Search by name or ID
- Filter by status
- Select a patient to view details
- Update status:
  - Waiting
  - In Progress
  - Completed
  - Assistance Needed
  - Cancelled

### Analytics
- Prototype analytics view (read-only).

### Settings
- Enable/disable which vitals are included in the flow.
- Save settings (kiosk reloads to apply).

## Current limitations (prototype)

- PIN is currently hardcoded in the UI component.
- Settings like Hospital Name and Kiosk Identifier appear in the UI but are not persisted/used consistently.
- “Clear records” only clears local kiosk storage; remote database may still contain records.
