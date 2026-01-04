# Real-Time Data Flow Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   LOURDES HOSPITAL KIOSK SYSTEM                  │
│                     Real-Time Architecture                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   KIOSK #1   │      │   KIOSK #2   │      │   KIOSK #3   │
│              │      │              │      │              │
│ [Patient     │      │ [Patient     │      │ [Patient     │
│  Check-In]   │      │  Check-In]   │      │  Check-In]   │
│              │      │              │      │              │
│ localStorage │      │ localStorage │      │ localStorage │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
              ┌──────────────────────────┐
              │   SUPABASE CLOUD         │
              │                          │
              │  ┌────────────────────┐  │
              │  │ PostgreSQL         │  │
              │  │ • patients         │  │
              │  │ • assistance_req   │  │
              │  └────────────────────┘  │
              │                          │
              │  ┌────────────────────┐  │
              │  │ Real-Time Engine   │  │
              │  │ (WebSocket Server) │  │
              │  └────────────────────┘  │
              └──────────┬───────────────┘
                        │
                        │ Real-Time Subscriptions
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Admin Dash 1 │ │ Admin Dash 2 │ │ Admin Dash 3 │
│              │ │              │ │              │
│ [Patient     │ │ [Patient     │ │ [Patient     │
│  Queue]      │ │  Queue]      │ │  Queue]      │
│              │ │              │ │              │
│ 🟢 Real-time │ │ 🟢 Real-time │ │ 🟢 Real-time │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Data Flow Sequence

### 1. Patient Check-In (Kiosk → Database)

```
┌──────────┐
│  KIOSK   │
│  Screen  │
└────┬─────┘
     │
     │ 1. User clicks "Submit"
     ▼
┌─────────────────┐
│ ReviewScreen    │
│ handleSubmit()  │
└────┬────────────┘
     │
     │ 2. Calls onSubmit()
     ▼
┌─────────────────┐
│ SuccessScreen   │
│ useEffect()     │
└────┬────────────┘
     │
     │ 3. savePatientRecord(data)
     ▼
┌─────────────────────────────────────────┐
│ patientService.ts                       │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Step 1: Generate ID              │    │
│ │ LRD-20260104-0001               │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Step 2: Save to localStorage     │    │
│ │ Time: <10ms (INSTANT)           │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Step 3: Sync to Supabase        │    │
│ │ Time: 100-500ms                 │    │
│ │ Console: ✅ synced to Supabase  │    │
│ └─────────────────────────────────┘    │
└─────────────┬───────────────────────────┘
              │
              │ HTTP POST /patients
              ▼
┌─────────────────────────────────────────┐
│ SUPABASE                                │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ PostgreSQL INSERT                │    │
│ │ Time: ~100ms                    │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Real-Time Broadcast              │    │
│ │ Event: INSERT                   │    │
│ │ Payload: { new: {...} }         │    │
│ │ Time: ~200ms                    │    │
│ └─────────────────────────────────┘    │
└─────────────┬───────────────────────────┘
              │
              │ WebSocket Push
              ▼
       ┌──────────────┐
       │ All Connected│
       │ Admin Clients│
       └──────────────┘
```

### 2. Real-Time Update (Database → Admin Dashboard)

```
┌─────────────────────────────────────────┐
│ SUPABASE Real-Time Engine               │
│ broadcasts INSERT event                 │
└─────────────┬───────────────────────────┘
              │
              │ WebSocket message
              │ { event: 'INSERT', table: 'patients' }
              │
              ▼
┌─────────────────────────────────────────┐
│ AdminDashboard.tsx                      │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ useEffect() - Setup              │    │
│ │ supabase.channel()               │    │
│ │ .on('postgres_changes', ...)     │    │
│ │ .subscribe()                     │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Callback triggered               │    │
│ │ console.log('Patient change')    │    │
│ │ loadData() called                │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ State update                     │    │
│ │ setPatients(newData)             │    │
│ │ UI re-renders                    │    │
│ │ Time: <50ms (INSTANT)           │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
              │
              ▼
        ┌──────────┐
        │   UI     │
        │ Updates! │
        └──────────┘
```

### 3. Status Update (Admin → Database → All Admins)

```
Admin #1 Changes Status
        │
        │ 1. Click "In Progress"
        ▼
┌──────────────────────────┐
│ handleStatusUpdate()     │
└────┬─────────────────────┘
     │
     │ 2. updatePatientStatus()
     ▼
┌─────────────────────────────────────────┐
│ patientService.ts                       │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Step 1: Optimistic Update        │    │
│ │ Update localStorage FIRST        │    │
│ │ Time: <10ms                     │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Step 2: Sync to Supabase        │    │
│ │ UPDATE patients SET status=...  │    │
│ │ Time: 100-300ms                 │    │
│ └─────────────────────────────────┘    │
└─────────────┬───────────────────────────┘
              │
              ▼
        SUPABASE UPDATE
              │
              │ Broadcasts UPDATE event
              ▼
Admin #1 (initiator)    Admin #2    Admin #3
    │                      │           │
    │ Already updated      │           │
    │ (optimistic)         │           │
    │                      ▼           ▼
    │                  loadData()   loadData()
    │                      │           │
    │                      ▼           ▼
    │                  UI Updates  UI Updates
    │                  (real-time) (real-time)
    └──────────────────────┴───────────┘
         All dashboards now in sync!
```

## Real-Time Subscription Details

### Subscription Setup (AdminDashboard.tsx)

```javascript
// This runs on component mount
useEffect(() => {
  // Initial data load
  loadData();
  
  // Set up WebSocket connection
  const patientsChannel = supabase
    .channel('patients-changes')
    .on(
      'postgres_changes',
      { 
        event: '*',           // INSERT, UPDATE, DELETE
        schema: 'public', 
        table: 'patients' 
      },
      (payload) => {
        // Triggered whenever ANY change happens
        console.log('📡 Patient change:', payload);
        loadData();  // Refresh data
      }
    )
    .subscribe();
    
  // Cleanup on unmount
  return () => {
    patientsChannel.unsubscribe();
  };
}, []);
```

### What Triggers Real-Time Updates

```
┌─────────────────────────────────────────┐
│ Database Operation     │ Triggers Event │
├─────────────────────────────────────────┤
│ INSERT INTO patients   │ ✅ Yes        │
│ UPDATE patients        │ ✅ Yes        │
│ DELETE FROM patients   │ ✅ Yes        │
│ SELECT * FROM patients │ ❌ No         │
└─────────────────────────────────────────┘

Event payload structure:
{
  eventType: 'INSERT' | 'UPDATE' | 'DELETE',
  schema: 'public',
  table: 'patients',
  new: { id, first_name, ... },    // For INSERT/UPDATE
  old: { id, first_name, ... }     // For UPDATE/DELETE
}
```

## Performance Characteristics

### Latency Breakdown (Patient Check-In)

```
Time (ms)   Event
─────────────────────────────────────────────
0           User clicks "Submit"
10          Data saved to localStorage ✅
110         HTTP request sent to Supabase
210         Database INSERT completed
410         Real-time broadcast sent
610         Admin dashboard receives event
660         UI re-renders with new data ✅

Total User Wait: 10ms (localStorage save)
Total Admin Update: ~600ms from kiosk submit
```

### Bandwidth Usage

```
┌──────────────────────────────────────────┐
│ Operation              │ Data Size       │
├──────────────────────────────────────────┤
│ Patient record save    │ ~2 KB          │
│ Status update          │ ~200 bytes     │
│ Real-time event        │ ~500 bytes     │
│ Assistance request     │ ~300 bytes     │
├──────────────────────────────────────────┤
│ WebSocket connection   │ ~50 bytes/min  │
│ (keepalive)            │ when idle      │
└──────────────────────────────────────────┘
```

## Failure Modes & Resilience

### Scenario 1: Database Temporarily Unavailable

```
Kiosk saves patient data
        │
        ├─ localStorage: ✅ SAVED (instant)
        │
        └─ Supabase: ❌ FAILED (network error)
                │
                └─ Console: ⚠️ "Network error, keeping as unsynced"
                
Patient can continue!
Data will sync on next operation or when online
```

### Scenario 2: Real-Time Connection Drops

```
WebSocket disconnected
        │
        ├─ Supabase auto-reconnects (built-in)
        │
        └─ Fallback: 30-second polling
                │
                └─ Admin still gets updates (slower)
```

### Scenario 3: Concurrent Status Updates

```
Admin A changes status → "In Progress"
Admin B changes status → "Completed" (1 second later)

Result: Last write wins
Final status: "Completed"
Both dashboards sync to same state via real-time
```

## Console Logging Reference

### Success Messages (✅)

```javascript
// Patient saved successfully
✅ Patient record synced to Supabase: LRD-20260104-0001

// Status updated
✅ Patient status updated in Supabase: LRD-20260104-0001 In Progress

// Assistance request created
✅ Assistance request synced to Supabase: AST-1736012345678

// Real-time subscription active
✅ Real-time subscription active
   Listening for changes on patients table
```

### Warning Messages (⚠️)

```javascript
// Sync failed but data saved locally
⚠️ Supabase insert failed, keeping as unsynced: [error details]

// Network error
⚠️ Network error during save, keeping as unsynced: [error details]

// Supabase not configured
⚠️ Supabase not configured - data saved to localStorage only
```

### Real-Time Events (📡)

```javascript
// Event received from database
Patient change received: {
  eventType: 'INSERT',
  schema: 'public',
  table: 'patients',
  new: {
    id: 'LRD-20260104-0001',
    first_name: 'Juan',
    last_name: 'Dela Cruz',
    ...
  }
}
```

## Testing Real-Time Flow

### Test 1: End-to-End Flow

```bash
# Terminal 1
npm run dev

# Browser Console
testDB.connection()  # Should show all ✅
```

### Test 2: Multi-Client Sync

```
1. Open Tab 1: http://localhost:5173 (Kiosk)
2. Open Tab 2: http://localhost:5173 (Admin)
3. Open Tab 3: http://localhost:5173 (Admin #2)
4. Complete check-in on Tab 1
5. Observe: Tabs 2 and 3 update within 1-2 seconds
```

### Test 3: Status Update Broadcast

```
1. Open 2 admin dashboard tabs
2. In Tab 1: Change patient status
3. In Tab 2: Status should update automatically
4. Console should show: "Patient change received"
```

## Architecture Benefits

✅ **Instant User Feedback**
- localStorage save happens in <10ms
- User sees confirmation immediately

✅ **Real-Time Collaboration**
- Multiple staff can work simultaneously
- All see same data without refresh

✅ **Offline Resilience**
- System works without internet
- Data syncs when connection restored

✅ **Scalability**
- Supabase handles WebSocket connections
- No custom server infrastructure needed

✅ **Maintainability**
- Clear separation of concerns
- Comprehensive logging for debugging
- Test utilities for verification

---

*This architecture ensures data is never lost while providing the best real-time experience possible.*
