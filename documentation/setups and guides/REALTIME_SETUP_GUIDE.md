# Real-Time Database Setup Guide

## ✅ Current Configuration Status

Your system is configured for **real-time data processing**:
- ✅ Supabase URL configured
- ✅ Supabase Anon Key configured
- ✅ Real-time subscriptions implemented
- ✅ Automatic sync on save

## 🔄 How Real-Time Works

### 1. Patient Check-In Flow
When a patient completes check-in:
1. **Local Save** → Data saved to localStorage (instant)
2. **Database Sync** → Data automatically synced to Supabase
3. **Real-Time Broadcast** → All connected admin dashboards receive update instantly
4. **No Refresh Needed** → Changes appear immediately

### 2. Admin Dashboard
The admin dashboard uses **Supabase Real-Time subscriptions**:
- Listens for INSERT, UPDATE, DELETE events on `patients` table
- Listens for changes on `assistance_requests` table
- Updates UI automatically without page refresh
- Green "Real-time" badge indicates active connection

### 3. Status Updates
When admin changes patient status:
1. **Optimistic Update** → UI updates immediately
2. **Database Sync** → Status saved to Supabase
3. **Broadcast** → Other admin screens update instantly

## 🗄️ Database Schema Verification

### Required Tables

#### 1. `patients` table
```sql
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  gender TEXT NOT NULL,
  civil_status TEXT,
  phone TEXT NOT NULL,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  vitals JSONB,
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Waiting',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust for production)
CREATE POLICY "Allow all operations on patients" ON patients
  FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
```

#### 2. `assistance_requests` table
```sql
CREATE TABLE assistance_requests (
  id TEXT PRIMARY KEY,
  kiosk_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE assistance_requests ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "Allow all operations on assistance_requests" ON assistance_requests
  FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE assistance_requests;
```

## 🧪 Testing Real-Time

### Test 1: Patient Check-In
1. Open **kiosk interface** in one browser tab
2. Open **admin dashboard** in another tab
3. Complete a patient check-in on kiosk
4. **Expected Result**: New patient appears in admin dashboard within 1-2 seconds without refresh

### Test 2: Status Update
1. Open **admin dashboard** in two browser tabs
2. In Tab 1: Change a patient status to "In Progress"
3. **Expected Result**: Tab 2 shows the status change immediately

### Test 3: Assistance Request
1. Open **kiosk interface**
2. Open **admin dashboard** in another tab/window
3. Click "Need Help?" button on kiosk
4. **Expected Result**: Red alert badge appears on admin sidebar instantly

## 🔍 Troubleshooting

### Issue: Data not appearing in admin dashboard

**Solution 1**: Check browser console for logs
- Look for ✅ "Patient record synced to Supabase" messages
- Look for ⚠️ warning messages about sync failures

**Solution 2**: Verify Supabase connection
```javascript
// Open browser console and run:
import { supabase } from './services/supabaseClient';
console.log('Supabase client:', supabase);
```

**Solution 3**: Check Supabase real-time is enabled
1. Go to Supabase Dashboard → Database → Replication
2. Ensure `patients` and `assistance_requests` tables are enabled
3. Click "Enable Replication" if needed

### Issue: Real-time badge not showing

**Cause**: Supabase real-time not configured or connection failed

**Fix**: 
1. Verify `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Restart dev server: `npm run dev`
3. Check Supabase Dashboard → Settings → API → Realtime is enabled

### Issue: "⚠️ Supabase not configured" warnings

**Cause**: Environment variables not loading

**Fix**:
1. Ensure `.env` file exists in project root
2. Restart dev server completely
3. Verify variables start with `VITE_` prefix (required for Vite)

## 📊 Console Logging

The system logs all database operations:
- ✅ **Green checkmark**: Successful sync to database
- ⚠️ **Warning triangle**: Sync failed, data saved locally only
- 🔔 **Bell**: Real-time update received

**Example console output:**
```
✅ Patient record synced to Supabase: LRD-20260104-0001
Patient change received: { eventType: 'INSERT', new: {...} }
✅ Patient status updated in Supabase: LRD-20260104-0001 In Progress
```

## 🚀 Performance Notes

- **Latency**: Updates typically appear in 500ms-2 seconds
- **Offline Mode**: Data saved locally if database unreachable
- **Automatic Retry**: Failed syncs will retry on next operation
- **Fallback Polling**: If real-time fails, polls every 30 seconds

## 🔐 Production Recommendations

1. **Tighten RLS Policies**: Remove `USING (true)` and implement proper role-based access
2. **Add Authentication**: Implement Supabase Auth for admin dashboard
3. **Rate Limiting**: Configure Supabase rate limits to prevent abuse
4. **Monitoring**: Set up alerts for failed sync operations
5. **Backup Strategy**: Implement daily database backups via Supabase

## 📱 Multiple Kiosk Setup

For multiple kiosks:
1. Set unique `kioskId` in Admin → Settings for each kiosk
2. Each kiosk maintains its own localStorage
3. All kiosks sync to same Supabase database
4. Admin dashboard shows all patients from all kiosks in real-time

## ⚡ Quick Verification

Run this in browser console on any page:
```javascript
// Check if Supabase is configured
localStorage.getItem('lourdes_patient_records') !== null 
  ? console.log('✅ Local storage working')
  : console.log('⚠️ No local data yet');

// Check environment
console.log('ENV Check:', {
  hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});
```

Expected output:
```
✅ Local storage working
ENV Check: { hasUrl: true, hasKey: true }
```

---

## 🎯 Summary

Your system now has:
- ✅ **Real-time updates** via Supabase subscriptions
- ✅ **Instant sync** on patient check-in
- ✅ **No refresh needed** for admin dashboard
- ✅ **Offline resilience** with localStorage fallback
- ✅ **Console logging** for debugging
- ✅ **Visual indicators** for sync status

All data processing happens **in real-time**. The admin dashboard will update automatically whenever:
- New patient checks in on any kiosk
- Patient status changes
- Assistance request is created or resolved

No browser refresh required! 🚀
