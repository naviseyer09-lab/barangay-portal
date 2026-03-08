# Resident Registration & Account Management - Updated

## Changes Made

### 1. **Frontend - Removed Self-Registration**
   - **ResidentLogin.tsx**: Removed "Register here" button
   - **routes.tsx**: Removed `/resident/register` route
   - Message now shows: "Contact your barangay administrator for account creation"

### 2. **Backend - Disabled Resident Self-Registration**
   - **auth.js**: Changed `/resident/register` endpoint to return error:
     ```
     "Self-registration is disabled. Only barangay administrators can create resident accounts."
     ```

### 3. **New Admin Feature - Create Resident Accounts**
   - **admin.js**: Added new endpoint `POST /admin/residents/create`
     - Requires admin authentication
     - Creates resident account with username & password
     - Fields: username, password, email, fullName, address, contactNumber, birthdate, gender, civilStatus
   
### 4. **Frontend - Resident Management Updated**
   - **ResidentManagement.tsx**: 
     - Updated "Add Resident" button and modal
     - Now includes PASSWORD field (required when creating account)
     - Calls new API endpoint `createResident()`
     - Shows success/error toast notifications
     - Form validation before submission

### 5. **API - New Function Created**
   - **api.ts**: Added `createResident()` function
     - Calls `/admin/residents/create` endpoint
     - Accepts resident creation data with password

## How It Works

### Admin Creating Resident Account
1. Admin logs in → Goes to Resident Management
2. Clicks "Add Resident" button
3. Fills in form:
   - Full Name
   - Username (for login)
   - **Password** (admin sets initial password)
   - Email
   - Address
   - Contact Number
   - Birthdate, Gender, Civil Status
4. Clicks "Create Resident"
5. Resident account is created and ready for login

### Resident Portal Changes
- ✅ Removed self-registration option
- ✅ Login page now says: "Contact your barangay administrator for account creation"
- ✅ Residents can only login with admin-created credentials
- ✅ Residents can change password after login (existing feature)
- ✅ Residents can logout

## Files Modified

1. `src/app/pages/ResidentLogin.tsx` - Removed register button
2. `src/app/pages/ResidentManagement.tsx` - Added create resident with API
3. `src/app/routes.tsx` - Removed /resident/register route
4. `src/lib/api.ts` - Added createResident() function
5. `backend/routes/auth.js` - Disabled resident self-registration
6. `backend/routes/admin.js` - Added create resident endpoint

## Security Features

✅ Resident creation requires admin authentication
✅ Self-registration is blocked and returns error message
✅ Password hashing with bcryptjs (12 salt rounds)
✅ Input validation for all fields
✅ Unique username and email enforcement
✅ Account status automatically set to "Active"

## Account Types

### Admin Can:
- ✅ Create resident accounts
- ✅ Create other admin/staff accounts
- ✅ Manage resident information
- ✅ Update resident status (Active/Inactive)
- ✅ View all accounts

### Resident Can:
- ✅ Login with credentials
- ✅ View profile
- ✅ Request services
- ✅ Change password
- ✅ Logout
- ❌ Cannot create own account

## Testing

To create a test resident via API:
```bash
curl -X POST http://localhost:5000/api/admin/residents/create \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123",
    "email": "test@example.com",
    "fullName": "Test User",
    "address": "123 Main St",
    "contactNumber": "09123456789",
    "birthdate": "1995-05-15",
    "gender": "Male",
    "civilStatus": "Single"
  }'
```

## Endpoints

### Admin Only
- `POST /api/admin/residents/create` - Create resident account (requires admin auth)

### Blocked
- `POST /api/auth/resident/register` - Returns 403 error (self-registration disabled)
