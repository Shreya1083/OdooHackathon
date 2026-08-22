# Section 1.3 Definitions & Abbreviations - Verification

## ❌ Issue Found: Missing HR Role Implementation

### Current Implementation:
The system currently only supports **2 roles**:
- `admin` - Full system access
- `employee` - Limited access

### Required by Spec (Section 1.3):
The specification defines **3 user types**:
1. **Admin** - User with management and approval privileges
2. **HR Officer** - User with management and approval privileges  
3. **Employee** - Regular user with limited access

## 🔍 Analysis:

### Backend - User Model:
**File**: `backend/models/User.js`
```javascript
role: {
  type: String,
  enum: ['admin', 'employee'], // ❌ Missing 'hr' role
  default: 'employee'
}
```

### Leave Types Implementation:
**File**: `backend/models/Leave.js`
```javascript
type: {
  type: String,
  enum: ['paid', 'sick', 'unpaid', 'casual'], // ✅ Covers Time-Off types
  required: true
}
```

**Status**: ✅ Properly implements:
- Paid leave
- Sick leave
- Unpaid leave
- Casual leave (additional)

## 🛠️ Required Fixes:

### 1. Add 'hr' Role to User Model
- Update User schema enum to include 'hr'
- HR should have similar privileges as admin for HR-related functions
- HR should NOT have full admin privileges (user deletion, system config)

### 2. Update Authorization Middleware
- Modify `authorize` middleware to accept 'hr' role where appropriate
- Leave approval: admin OR hr
- Attendance management: admin OR hr
- Payroll: admin OR hr
- User management: admin ONLY

### 3. Update Frontend Role Handling
- Add 'hr' role to AuthContext
- Update ProtectedRoute to handle 'hr' role
- Create HR-specific dashboard (or enhance admin dashboard for HR)
- Update role checks in UI components

### 4. Update Routes
- Admin routes that should also allow HR:
  - `/api/leave/all` - View all leaves
  - `/api/leave/:id` - Approve/reject
  - `/api/attendance/all` - View all attendance
  - `/api/payroll/*` - Payroll management

- Admin-only routes:
  - `/api/admin/users` - User CRUD operations
  - System configuration routes

## 📋 Definitions Checklist:

| Definition | Implementation | Status |
|-----------|----------------|--------|
| Admin - management privileges | ✅ Implemented | Complete |
| HR Officer - management privileges | ❌ Role missing | **NEEDS FIX** |
| Employee - limited access | ✅ Implemented | Complete |
| Time-Off: Paid leave | ✅ In Leave model | Complete |
| Time-Off: Sick leave | ✅ In Leave model | Complete |
| Time-Off: Unpaid leave | ✅ In Leave model | Complete |

## 🎯 Recommendation:

**Option 1**: Add separate 'hr' role with specific permissions
- Better role separation
- More granular access control
- Follows spec exactly

**Option 2**: Treat 'admin' as both Admin and HR
- Simpler implementation
- Admins can perform all HR functions
- Document that "Admin" encompasses HR duties

**Recommended**: **Option 1** - Add the 'hr' role to fully comply with spec 1.3

---

**Action Required**: Implement HR role across backend and frontend to match the definitions in section 1.3.
