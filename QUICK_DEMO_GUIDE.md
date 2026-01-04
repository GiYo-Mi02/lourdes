# 🎯 Quick Demo Guide

## Language Switching Demo

### Step 1: Open Kiosk
```
npm run dev
Navigate to: http://localhost:3000
```

### Step 2: See Default English
```
Screen shows:
┌─────────────────────────────────────┐
│ 🏥                                  │
│                                     │
│   Welcome to Patient Check-In       │
│   Please complete this self-service │
│   process to begin your visit.      │
│                                     │
│   This will take about 5-7 minutes: │
│   ✓ Review Personal Information     │
│   ✓ Update Contact Details          │
│   ✓ Automated Vital Signs           │
│                                     │
│   [Start Check-In →]                │
└─────────────────────────────────────┘
```

### Step 3: Switch to Tagalog
```
1. Look at top-left toolbar
2. Find dropdown showing: 🇺🇸 EN
3. Click and select: 🇵🇭 TL
4. INSTANT CHANGE!
```

### Step 4: See Tagalog Version
```
Screen now shows:
┌─────────────────────────────────────┐
│ 🏥                                  │
│                                     │
│   Maligayang Pagdating sa           │
│   Patient Check-In                  │
│   Ang kiosk na ito ay gagabay sa    │
│   iyo sa isang mabilis at madaling  │
│   proseso ng rehistrasyon.          │
│                                     │
│   Aabutin lamang ng 5-7 minuto:     │
│   ✓ Suriin ang Personal na          │
│     Impormasyon                      │
│   ✓ I-update ang Detalye ng         │
│     Pakikipag-ugnayan                │
│   ✓ Sukatin ang Vital Signs         │
│                                     │
│   [Simulan ang Check-In →]          │
└─────────────────────────────────────┘
```

---

## Assistance Resolution Demo

### Step 1: Open Two Windows
```
Window 1 (Kiosk): http://localhost:3000
Window 2 (Admin):  http://localhost:3000 → Click "Admin"
```

### Step 2: Request Help
```
In Window 1 (Kiosk):
1. Click "Start Check-In"
2. Fill personal info
3. Fill contact info
4. Start vitals measurement
5. Click "Need Help?" button

You'll see:
┌─────────────────────────────────────┐
│        👨‍⚕️ (animated)                │
│                                     │
│    Assistance Requested             │
│    Staff notified 5s ago            │
│                                     │
│    ✓ Signal Sent Successfully       │
│    A nurse is on their way.         │
│                                     │
│    Please remain at the kiosk.      │
│    Help will arrive shortly.        │
│                                     │
│    📍 Location: KIOSK-01            │
│                                     │
│    [Cancel Request & Return]        │
└─────────────────────────────────────┘
```

### Step 3: Admin Sees Request
```
In Window 2 (Admin):
┌─────────────────────────────────────┐
│ 🔔 (1) Assistance Needed            │
│                                     │
│ Click the bell icon at top          │
│                                     │
│ You'll see panel:                   │
│ ┌─────────────────────────────────┐ │
│ │ 📍 KIOSK-01                     │ │
│ │ Requested 1:23:45 PM            │ │
│ │ [✓ Resolved] button             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Step 4: Admin Resolves
```
In Window 2 (Admin):
Click [✓ Resolved] button
```

### Step 5: User Returns Automatically ⭐
```
In Window 1 (Kiosk):
WITHIN 2 SECONDS:
- Screen automatically changes
- Returns to Vital Measurement screen
- User can continue where they left off!

No need to click "Cancel"!
No need to start over!
SEAMLESS! ✨
```

---

## Translation Examples by Screen

### Welcome Screen
| English | Tagalog |
|---------|---------|
| Welcome to Patient Check-In | Maligayang Pagdating sa Patient Check-In |
| Start Check-In | Simulan ang Check-In |

### Personal Info Screen
| English | Tagalog |
|---------|---------|
| Personal Information | Personal na Impormasyon |
| First Name | Pangalan |
| Last Name | Apelyido |
| Date of Birth | Petsa ng Kapanganakan |
| Gender | Kasarian |
| Male | Lalaki |
| Female | Babae |
| Civil Status | Katayuang Sibil |
| Single | Single |
| Married | Kasal |

### Contact Info Screen
| English | Tagalog |
|---------|---------|
| Contact Information | Impormasyon sa Pakikipag-ugnayan |
| Phone Number | Numero ng Telepono |
| Address Line 1 | Address Line 1 |
| City/Municipality | Lungsod/Munisipalidad |
| Province | Probinsya |
| Postal Code | Postal Code |
| Guardian Information | Impormasyon ng Tagapag-alaga |

### Vitals Briefing Screen
| English | Tagalog |
|---------|---------|
| We'll now measure 5 vital signs | Susukatin natin ang 5 vital signs |
| using our automated devices | gamit ang aming automated devices |
| Respiratory Rate | Respiratory Rate |
| Pulse Rate | Pulse Rate |
| Blood Oxygen (SpO₂) | Blood Oxygen (SpO₂) |
| Blood Pressure | Blood Pressure |
| Body Temperature | Temperatura ng Katawan |

### Vital Measurement Screen
| English | Tagalog |
|---------|---------|
| Measuring | Sinusukat |
| Please remain still | Mangyaring manatiling tahimik |
| Measurement Complete | Tapos na ang Pagsukat |
| Measurement Failed | Nabigo ang Pagsukat |
| Retry Measurement | Subukan Muli ang Pagsukat |
| Skip (Optional) | Laktawan (Opsyonal) |
| Continue | Magpatuloy |
| Need Help? | Kailangan ng Tulong? |

### Vital Instructions (Example: Respiratory Rate)
| English | Tagalog |
|---------|---------|
| Sit upright comfortably. | Umupo nang tuwid at komportable. |
| Breathe normally. | Huminga nang normal. |
| Do not talk during measurement. | Huwag magsalita habang sinusukat. |

### Assistance Screen
| English | Tagalog |
|---------|---------|
| Assistance Requested | Humiling ng Tulong |
| Staff notified | Naabisuhan na ang staff |
| A nurse is on their way. | Paparating na ang isang nurse. |
| Location | Lokasyon |
| Cancel Request & Return | Kanselahin ang Kahilingan at Bumalik |

### Navigation Buttons
| English | Tagalog |
|---------|---------|
| Next | Susunod |
| Back | Bumalik |
| Continue | Magpatuloy |
| Cancel | Kanselahin |
| Submit Check-In | Isumite ang Check-In |

---

## Testing Commands

### Start the Application
```powershell
npm run dev
```

### Open in Browser
```
http://localhost:3000
```

### Test Language Switch
```
1. Open dev tools (F12)
2. In Console, type:
   localStorage.getItem('lourdes_accessibility')
3. You'll see current settings including language
```

### Test Assistance System
```
1. Open two browser tabs
2. Tab 1: Kiosk mode
3. Tab 2: Admin mode (click Admin button)
4. Request help in Tab 1
5. Resolve in Tab 2
6. Watch Tab 1 auto-return!
```

### Check for Errors
```
F12 → Console tab
Should see:
✅ No red errors
✅ Green success messages
✅ Database connection working
```

---

## What to Look For

### ✅ Language System Working
- [ ] Language dropdown shows 🇺🇸 EN and 🇵🇭 TL
- [ ] Clicking TL changes ALL text immediately
- [ ] Welcome screen title changes
- [ ] All form labels change
- [ ] All buttons change
- [ ] Navigation text changes
- [ ] Vital instructions change
- [ ] Switching back to EN works

### ✅ Assistance Fix Working
- [ ] User can request help
- [ ] Admin sees notification
- [ ] Admin can click "Resolved"
- [ ] User screen changes within 2 seconds
- [ ] User returns to exact page they were on
- [ ] No errors in console

---

## Troubleshooting

### Language Not Changing?
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check console for errors
4. Verify translations.ts file exists
5. Verify useTranslation.ts file exists
```

### Assistance Not Auto-Returning?
```
1. Check both windows are open
2. Verify Supabase connection is working
3. Check console for errors
4. Wait up to 2 seconds after clicking "Resolved"
5. Verify assistance request ID is correct
```

---

## Success Indicators

### ✓ You'll Know It's Working When:
1. Language dropdown appears at top-left
2. Selecting Tagalog changes the welcome message instantly
3. All screens show Tagalog text
4. Requesting help shows translated assistance screen
5. Admin clicking "Resolved" makes user return automatically
6. No error messages in console

### 🎉 Perfect Setup:
```
Console shows:
✅ Database connection successful!
✅ Assistance request created
✅ Assistance request resolved in Supabase
✅ Language changed to: TL
```

---

*All systems operational! Enjoy your bilingual kiosk!* 🇵🇭 🇺🇸
