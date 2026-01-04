# 🎯 Quick Reference Card

## 🚀 Getting Started (2 Minutes)

### 1. Enable Real-Time (ONE-TIME SETUP)
```
1. Go to: https://blketilaguinzcbynpce.supabase.co
2. Click: Database → Replication
3. Enable: patients ✅
4. Enable: assistance_requests ✅
5. Done! 🎉
```

### 2. Start Application
```bash
npm run dev
# Opens at http://localhost:3000
```

### 3. Test Real-Time
```javascript
// Open browser console (F12) and run:
testDB.connection()
// Should see: ✅ ✅ ✅ ✅
```

---

## 🧪 Testing Checklist

### ✅ Test 1: Patient Check-In (30 seconds)
```
1. Open: Kiosk (Tab 1) + Admin Dashboard (Tab 2)
2. Complete check-in on Tab 1
3. Watch Tab 2 - Patient appears in ~1 second
4. ✅ Success: No page refresh needed!
```

### ✅ Test 2: Status Update (20 seconds)
```
1. Admin Tab 1: Click patient → Change status
2. Admin Tab 2: Status updates automatically
3. ✅ Success: Real-time sync working!
```

### ✅ Test 3: Assistance Alert (15 seconds)
```
1. Kiosk: Click "Need Help?"
2. Admin: Red badge appears (no refresh)
3. Admin: Click badge → Resolve
4. ✅ Success: Real-time alerts working!
```

---

## 📊 Console Commands

### Quick Status Check
```javascript
testDB.status()
```
**Expected Output:**
```
✅ VITE_SUPABASE_URL: Set
✅ VITE_SUPABASE_ANON_KEY: Set
✅ Supabase client: Initialized
```

### Full Connection Test
```javascript
testDB.connection()
```
**Expected Output:**
```
✅ Supabase client initialized
✅ Can access patients table
✅ Real-time subscription active
✅ Test patient record created
```

### Test Assistance System
```javascript
testDB.assistance()
```

---

## 🔍 What to Look For

### ✅ Success Indicators

**Admin Dashboard:**
- 🟢 Green "Real-time" badge visible
- Patients appear without refresh
- Status changes sync across tabs

**Browser Console:**
```
✅ Patient record synced to Supabase: LRD-20260104-0001
Patient change received: { eventType: 'INSERT' }
✅ Real-time subscription active
```

**No Errors About:**
- ❌ "Supabase not configured"
- ❌ "Cannot access table"
- ❌ "Real-time subscription failed"

---

## 🐛 Quick Fixes

### Problem: Data not syncing

**Solution:**
```javascript
// Check console for:
testDB.status()
// If Supabase shows ❌:
// 1. Check .env file exists
// 2. Restart: npm run dev
// 3. Hard refresh browser (Ctrl+Shift+R)
```

### Problem: Real-time not working

**Solution:**
```
1. Supabase Dashboard → Database → Replication
2. Verify both tables enabled
3. Restart browser completely
4. Test again
```

### Problem: Table not found

**Solution:**
```sql
-- Run in Supabase SQL Editor:
-- Copy entire contents of database/supabase_schema.sql
-- Execute
-- Refresh page
```

---

## 📱 URLs

- **Kiosk:** http://localhost:3000
- **Admin:** http://localhost:3000 → Click "Admin Portal"
- **Supabase:** https://blketilaguinzcbynpce.supabase.co

---

## 🎯 Key Features

✅ **Philippine Format Support**
- Provinces (not US states)
- 4-digit postal codes
- +63 / 09XX mobile numbers

✅ **Real-Time Sync**
- Instant localStorage save
- Auto-sync to Supabase
- Live updates across devices

✅ **Professional IDs**
- Format: LRD-20260104-0001
- Daily sequence counter
- Hospital prefix (LRD)

✅ **Assistance System**
- Real-time help requests
- Kiosk location tracking
- Instant staff notification

---

## 📈 Performance

- **Local save:** <10ms (instant)
- **Database sync:** 100-500ms
- **Real-time update:** 500ms-2s
- **Offline mode:** ✅ Works without internet

---

## 🔐 Before Production

```bash
# Security checklist:
□ Tighten RLS policies
□ Add Supabase Auth
□ Enable rate limiting
□ Set up monitoring
□ Configure backups
```

---

## 📚 Documentation

- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What was built
- [REALTIME_ARCHITECTURE.md](REALTIME_ARCHITECTURE.md) - How it works
- [REALTIME_SETUP_GUIDE.md](REALTIME_SETUP_GUIDE.md) - Detailed setup
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Step-by-step guide

---

## 💡 Pro Tips

1. **Always check console first** for errors
2. **Enable Supabase replication** before testing
3. **Use testDB utilities** for quick diagnosis
4. **Hard refresh (Ctrl+Shift+R)** if issues persist
5. **Check Supabase logs** for database errors

---

## ✨ You're Ready!

Your system now has:
- ✅ Real-time data processing
- ✅ Philippine address support
- ✅ Professional patient IDs
- ✅ Instant notifications
- ✅ Offline resilience

**Next:** Enable replication → Test → Deploy! 🚀

---

*Need help? Run `testDB.connection()` and check the output*
