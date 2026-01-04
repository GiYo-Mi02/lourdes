# Real-Time System Setup Checklist

## ✅ Completed Steps

Based on your current setup, these are already done:
- [x] Supabase project created
- [x] Environment variables configured in `.env`
- [x] Real-time subscriptions implemented in code
- [x] Sync logging added
- [x] Philippine address format support added

## 🔧 Required Setup Steps

Follow these steps to enable real-time data processing:

### Step 1: Verify Database Schema ✅ **DO THIS FIRST**

1. Open Supabase Dashboard: https://blketilaguinzcbynpce.supabase.co
2. Go to **SQL Editor**
3. Run the verification script: `database/verify_schema.sql`

**Expected Results:**
- `patients` table should have 17+ columns
- `assistance_requests` table should have 6+ columns
- RLS should show policies for both tables

**If tables don't exist:**
- Run `database/supabase_schema.sql` (creates all tables)
- Or run `database/migration_add_assistance_requests.sql` (adds only assistance table)

### Step 2: Enable Real-Time Replication ⚡ **CRITICAL**

1. Go to **Database → Replication** in Supabase Dashboard
2. Find `patients` table
3. Click **Enable Replication** 
4. Find `assistance_requests` table
5. Click **Enable Replication**

**Why this matters:** Without replication enabled, real-time subscriptions won't work!

### Step 3: Test the System 🧪

1. Start dev server: `npm run dev`
2. Open browser console (F12)
3. Run: `testDB.status()`

**Expected Output:**
```
📊 System Status Check
Environment Variables:
  VITE_SUPABASE_URL: ✅ Set
  VITE_SUPABASE_ANON_KEY: ✅ Set
Local Storage:
  Patient Records: ✅ 0 records
  Kiosk Settings: ✅ Configured
Supabase Client:
  Status: ✅ Initialized
```

4. Run full test: `testDB.connection()`

**Expected Output:**
```
✅ Supabase client initialized
✅ Can access patients table
✅ Real-time subscription active
✅ Test patient record created
```

### Step 4: Test Real-Time Flow 🔄

**Test A: Patient Check-In**
1. Open two browser windows/tabs
2. Window 1: Kiosk interface (`http://localhost:5173`)
3. Window 2: Admin dashboard (`http://localhost:5173` → Click "Admin Portal")
4. Complete check-in in Window 1
5. **Watch Window 2** - new patient should appear within 1-2 seconds

**Test B: Status Update**
1. Keep both windows open from Test A
2. In admin dashboard, click on a patient
3. Change status to "In Progress"
4. Open another admin tab
5. **Verify** status change appears in both tabs instantly

**Test C: Assistance Request**
1. Kiosk window: Click "Need Help?" button
2. Admin window: Should see red badge appear on sidebar
3. Click alert, then "Resolved"
4. **Verify** badge disappears

## 📋 Troubleshooting Guide

### Issue: "❌ Cannot access patients table"

**Solution:**
1. Run `database/supabase_schema.sql` in SQL Editor
2. Or use Table Editor to create tables manually
3. Ensure RLS policies allow `anon` role access

**Quick Fix SQL:**
```sql
-- Allow anonymous access (for testing)
CREATE POLICY "Allow anonymous access" ON patients
  FOR ALL USING (true) WITH CHECK (true);
```

### Issue: "❌ Real-time subscription failed"

**Solution:**
1. Go to Database → Replication
2. Enable replication for `patients` and `assistance_requests`
3. Restart your browser (hard refresh: Ctrl+Shift+R)

### Issue: Data saves locally but not to database

**Check Console Logs:**
- ✅ "Patient record synced" = Working correctly
- ⚠️ "Supabase insert failed" = Permission issue
- ⚠️ "Network error" = Connection issue

**Solutions:**
1. Check `.env` file has correct URL and key
2. Restart dev server: `npm run dev`
3. Check Supabase Dashboard → Settings → API → keys are correct
4. Verify RLS policies allow inserts

### Issue: Admin dashboard not updating

**Solutions:**
1. Check if "Real-time" badge is green in dashboard
2. Open console and look for "Real-time event received" messages
3. Verify replication is enabled (Step 2 above)
4. Check for JavaScript errors in console

### Issue: Environment variables not loading

**Solution:**
```bash
# Stop the server (Ctrl+C)
# Restart it
npm run dev
```

**Verify in console:**
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should print: https://blketilaguinzcbynpce.supabase.co
```

## 🎯 Success Criteria

You'll know everything is working when:

✅ **Console shows:**
- ✅ Patient record synced to Supabase: LRD-20260104-XXXX
- Patient change received: { eventType: 'INSERT', ... }
- ✅ Patient status updated in Supabase: LRD-20260104-XXXX

✅ **Admin dashboard shows:**
- Green "Real-time" badge next to "Patient Intake Queue"
- Patients appear without page refresh
- Status changes appear instantly across all tabs

✅ **No warnings about:**
- "Supabase not configured"
- "Failed to sync"
- "Cannot access table"

## 🚀 Production Deployment

Before going live:

1. **Tighten RLS Policies**
```sql
-- Remove anonymous access
DROP POLICY "Allow anonymous access" ON patients;

-- Add role-based access
CREATE POLICY "Kiosk can insert" ON patients
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Staff can view" ON patients
  FOR SELECT USING (auth.role() = 'authenticated');
```

2. **Enable Supabase Auth**
- Add login for admin dashboard
- Configure email/password or OAuth
- Update policies to check `auth.uid()`

3. **Set up monitoring**
- Enable Supabase logging
- Monitor failed sync attempts
- Set up alerts for errors

4. **Configure backup**
- Enable automatic backups in Supabase
- Set retention period
- Test restore process

## 📞 Need Help?

If you're still having issues:

1. Run `testDB.connection()` in console and share the output
2. Check Supabase logs: Dashboard → Logs → Postgres Logs
3. Share any error messages from browser console
4. Verify your schema matches `database/supabase_schema.sql`

---

## 🎉 Quick Start (TL;DR)

1. ✅ You already have: Supabase configured, code updated
2. 🔧 **Do now**: Go to Supabase Dashboard → Database → Replication → Enable for both tables
3. 🧪 **Test**: Open console, run `testDB.connection()`
4. 🚀 **Use**: Open admin dashboard in one tab, kiosk in another, test check-in flow

That's it! Your real-time system is ready. 🎊
