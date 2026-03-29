# Barangay Aduas Norte Portal - Setup & Issues Fixed

## 🏛️ Barangay Information (Updated March 29, 2026)

**Name**: Barangay Aduas Norte  
**Captain**: Ivan Lloyd N. Reyes  
**Address**: Nueva Ecija, Cabanatuan City, Aduas Norte, Philippines  
**Contact**: 09918177027  
**Email**: aduasnorte.barangay@gov.ph  

## ✅ Problems Identified & Resolved

### 1. ✅ Backend Server Configuration
**Status**: Backend server running on `http://localhost:5000`
- SQLite database: `backend/database.sqlite`
- CORS configured for `localhost:5173` and `localhost:5174`
- All API endpoints registered and functional

### 2. ✅ Admin Registration System
**How it works**:
- **First Admin**: Automatically approved as Super Admin (no approval needed)
- **Subsequent Admins**: Set to "pending" status, requires Super Admin approval
- Admin can view/approve/reject staff accounts from Admin Dashboard

**Test Admin Account**:
- Username: `admin`
- Password: `admin123`
- Role: Super Admin (Already Approved)

### 3. ✅ Resident Registration & Approval System (March 29, 2026)
**New Feature**: Residents now require approval before login

**How it works**:
1. Admin creates resident account in "Resident Management"
2. Resident account created with status="pending"
3. Admin sees pending residents in "Pending Approvals" section
4. Admin clicks Approve or Reject button
5. Once approved, resident can login
6. Rejected residents cannot access portal

**Test Resident Account** (Pre-approved for testing):
- Username: `resident`
- Password: `resident123`
- Status: Approved (Active)

**Database Fields**:
- Added `status` column to residents table
- Values: "pending", "approved", "rejected"
- Defaults to "pending" for new registrations

### 4. ✅ Package.json Cleanup
**Fixes Applied**:
- Removed duplicate dependencies
- Removed unused packages (MUI, Material, next-themes)
- Fixed malformed sections
- Corrected pnpm overrides structure

## 🚀 How to Run

### Development Setup
```bash
# Terminal 1: Start Backend
cd backend
npm start
# Runs on http://localhost:5000

# Terminal 2: Start Frontend  
npm run dev
# Runs on http://localhost:5173 or http://localhost:5174
```

### Initialize Fresh Database
```bash
cd backend
npm run init-db      # Create tables
npm run seed-db      # Add test users
```

## 🔐 Login URLs

- **Admin**: http://localhost:5174/admin/login
  - Username: admin
  - Password: admin123

- **Resident**: http://localhost:5174/resident/login
  - Username: resident
  - Password: resident123

- **Staff Registration**: http://localhost:5174/admin/register
  - First admin is automatically approved as Super Admin

## 📋 Test Workflows

### Create New Super Admin Account
1. Go to http://localhost:5174/admin/register
2. Fill all required fields
3. Submit - automatically approved as Super Admin
4. Login with new credentials

### Create New Resident and Approve
1. Login as Super Admin
2. Go to Resident Management
3. Click "Add Resident"
4. Fill form and click "Add Resident"
5. New resident appears in "Pending Approvals" section
6. Click approve/reject button
7. Approved resident can now login

### Create New Staff and Approve
1. Go to http://localhost:5174/admin/register (as unauthenticated user)
2. Fill all required fields
3. Submit - status becomes "pending"
4. Login as Super Admin
5. Go to Staff Approval
6. Find staff member and click approve/reject
7. Approved staff can now login to admin portal

## 🐛 Troubleshooting

### "Failed to fetch" error on login
- Ensure backend server is running (`npm start` in backend folder)
- Check that port 5000 is not blocked
- Verify CORS is configured in backend

### "Invalid username or password"
- Check credentials are correct
- Ensure database is seeded (`npm run seed-db`)
- Verify user exists in database

### "Account pending approval"
- This is normal for newly created non-Super Admin accounts
- Contact Super Admin to approve your account
- Check "Pending Approvals" section in Admin Dashboard

### Port already in use
```bash
# Kill process using port 5000
netstat -ano | findstr ":5000"
taskkill /PID <PID> /F
```

## 📁 Key Files Modified

Recent updates (March 29, 2026):
- `src/app/data/mockData.ts` - Barangay Aduas Norte info
- `src/app/components/LandingHeader.tsx` - Header branding
- `src/app/components/Footer.tsx` - Footer with new contact info
- `src/app/pages/AdminLogin.tsx` - Dynamic barangay name
- `src/app/pages/AdminRegister.tsx` - Dynamic barangay name
- `src/app/pages/ResidentManagement.tsx` - Pending approvals UI
- `backend/config/database.js` - Added status column to residents
- `backend/routes/auth.js` - Check approval status on login
- `backend/routes/admin.js` - Approval endpoints
- `backend/scripts/seedDb.js` - Updated with status field

### To Initialize Fresh Database
```bash
cd backend
npm run init-db
npm run seed-db
```

## Login Flow

### Admin Portal
1. Go to `http://localhost:5173/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`

### Resident Portal
1. Go to `http://localhost:5173/resident/login`
2. Login with:
   - Username: `resident`
   - Password: `resident123`

## Files Modified

1. `/package.json` - Fixed dependencies
2. `/backend/package.json` - Added seed-db script
3. `/backend/scripts/seedDb.js` - Created new seed script

## Troubleshooting

**Still getting "Failed to fetch"?**
- Ensure backend server is running on port 5000
- Check if CORS is blocking requests
- Clear browser cache (Ctrl+Shift+Delete)
- Open browser DevTools (F12) → Network tab to see actual error

**Login page loads but can't submit?**
- Check browser console for JavaScript errors
- Verify database has test users: Check if `database.sqlite` file exists in `/backend/`

**API endpoints not working?**
- Test health endpoint: `http://localhost:5000/api/health` (should return `{"status":"OK",...}`)
- Check backend terminal for error logs

## Next Steps
1. Create additional admin/resident accounts through the registration pages
2. Configure proper JWT secret in `.env` for production
3. Set up database backups
4. Implement user approval workflow for new admin registrations
