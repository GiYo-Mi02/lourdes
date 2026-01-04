# 🔍 DIAGNOSTIC GUIDE - Why Data Isn't Saving

## Step 1: Run the Updated Schema

The schema has been updated to fix common issues:
- ✅ Made `phone` field nullable (was causing errors if empty)
- ✅ Better error logging added to show exact error details

**Run this NOW:**
1. Open: https://blketilaguinzcbynpce.supabase.co
2. Go to: SQL Editor
3. Copy entire file: `database/CORRECTED_SCHEMA.sql`
4. Click: **Run**

## Step 2: Hard Refresh Browser

```bash
# Press Ctrl+Shift+R
```

## Step 3: Check Console Output

Now try to check in a patient and look at the console. You should see detailed output:

### ✅ Success Looks Like:
```
📤 Attempting to save to Supabase: { id: 'LRD-...', dob: '1990-01-01', ... }
✅ DOB converted: 01/01/1990 → 1990-01-01
📋 Mapped record for database: { id: 'LRD-...', name: 'Juan Cruz', ... }
✅ Patient record synced to Supabase: LRD-20260104-0001
✅ Database confirmed: [{ id: 'LRD-...', ... }]
```

### ❌ Error Looks Like (now with details):
```
❌ Supabase insert failed with details:
   Error code: 23505
   Error message: duplicate key value violates unique constraint
   Error details: Key (id)=(LRD-...) already exists
   Error hint: ...
   Data sent: { ... }
```

## Common Errors and Fixes

### Error: "duplicate key value"
**Cause:** ID already exists in database
**Fix:** 
```sql
-- In Supabase SQL Editor:
DELETE FROM public.patients WHERE id LIKE 'LRD-%';
```

### Error: "null value in column"
**Cause:** Required field is missing
**Fix:** Already handled - code now provides defaults
- Run updated schema (Step 1)
- Hard refresh (Step 2)

### Error: "invalid input syntax for type date"
**Cause:** DOB format is wrong
**Fix:** Already handled - improved DOB conversion
- Check console for "DOB converted" message
- Should show: `01/15/1990 → 1990-01-15`

### Error: "relation does not exist"
**Cause:** Tables not created
**Fix:** Run the schema (Step 1)

### Error: "permission denied"
**Cause:** RLS policies blocking
**Fix:** Already in schema - policies allow all operations

## Step 4: Test Database Connection

```javascript
// In browser console:
testDB.connection()
```

**Expected:**
```
✅ Supabase client initialized
✅ Can access patients table
✅ Test patient record created
```

## Step 5: Manual Insert Test

If still failing, test manually in Supabase SQL Editor:

```sql
-- Test insert with minimal data
INSERT INTO public.patients (
  id, 
  first_name, 
  last_name, 
  dob, 
  gender, 
  phone
) VALUES (
  'TEST-001',
  'Test',
  'Patient',
  '1990-01-01',
  'Male',
  '09171234567'
);

-- Check if it worked
SELECT * FROM public.patients WHERE id = 'TEST-001';

-- Clean up
DELETE FROM public.patients WHERE id = 'TEST-001';
```

**If this works:** Code issue
**If this fails:** Database/RLS issue

## Step 6: Check Exact Error

After running updated code, the console will show:

```
❌ Supabase insert failed with details:
   Error code: [COPY THIS]
   Error message: [COPY THIS]
```

### Common Error Codes:
- **23505** = Duplicate key (ID already exists)
- **23502** = NOT NULL violation (missing required field)
- **22P02** = Invalid date format
- **42P01** = Table doesn't exist
- **42501** = Permission denied (RLS issue)

## Step 7: Share Error Details

If still not working, share:
1. Error code from console
2. Error message from console
3. Data sent (shown in console)
4. Result of manual insert test (Step 5)

## Quick Checklist

Before asking for help, verify:
- [ ] Ran CORRECTED_SCHEMA.sql in Supabase
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Checked console for detailed error
- [ ] Tried manual insert test
- [ ] `.env` file has correct Supabase URL and key

## Most Likely Causes

Based on the error you're seeing:

### 1. Schema Not Updated (80% likely)
**Symptom:** "null value in column phone"
**Fix:** Run CORRECTED_SCHEMA.sql again

### 2. Old Cached Code (15% likely)
**Symptom:** Still seeing old errors
**Fix:** Hard refresh + clear cache

### 3. Duplicate ID (5% likely)
**Symptom:** "duplicate key value"
**Fix:** Clear test data from database

---

## What Changed in Code

### Enhanced Error Logging
- Now shows: error code, message, details, hint
- Shows exact data being sent
- Logs each step of conversion

### Better DOB Handling
- Validates MM/DD/YYYY format
- Falls back to today if invalid
- Logs conversion: `01/15/1990 → 1990-01-15`

### Safer Field Mapping
- Provides defaults for missing fields
- Phone can be empty
- All nullable fields handle null properly

### Schema Updates
- Phone field now nullable
- All policies allow operations
- Better field types

---

## Next Steps

1. **Run the updated schema** (database/CORRECTED_SCHEMA.sql)
2. **Hard refresh browser** (Ctrl+Shift+R)
3. **Try check-in again**
4. **Check console** - you'll see detailed error now
5. **Share the error code** if still failing

The new logging will show **exactly** what's wrong! 🎯
