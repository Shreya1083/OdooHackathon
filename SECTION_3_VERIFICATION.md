# Section 3 - Functional Requirements Verification

## 3.1 Authentication & Authorization

### 3.1.1 Sign Up ❌ NEEDS FIXES

#### Required Fields:
| Field | Required | Current Status | Issue |
|-------|----------|----------------|-------|
| Employee ID | ✅ Required | ⚠️ Partial | Auto-generated, not user input |
| Email | ✅ Required | ✅ Implemented | Working |
| Password | ✅ Required | ✅ Implemented | Working |
| Role (Employee/HR) | ✅ Required | ❌ Missing | Not selectable during signup |

**Issues Found:**
1. ❌ **Employee ID**: Spec says users register "using Employee ID" but current implementation auto-generates it
2. ❌ **Role Selection**: Users cannot choose their role during signup (defaults to 'employee')
3. ⚠️ **Password Rules**: Basic validation exists (6 chars) but lacks comprehensive security rules
4. ❌ **Email Verification**: Not implemented

#### Current Password Validation:
```javascript
// backend/middleware/validate.js
validatePassword: password && password.length >= 6
```

**Missing Password Rules:**
- No uppercase letter requirement
- No number requirement
- No special character requirement
- No common password check

#### Email Verification:
- ❌ No email verification system
- ❌ No verification token generation
- ❌ No verification email sending
- ❌ No account activation workflow

**Backend Files to Update:**
- `backend/controllers/authController.js` - Add email verification
- `backend/middleware/validate.js` - Enhance password validation
- `backend/models/User.js` - Add `isEmailVerified`, `verificationToken` fields

**Frontend Files to Update:**
- `frontend/src/pages/auth/Signup.jsx` - Add employee ID field, role selection
- `frontend/src/pages/auth/Signup.jsx` - Enhance password strength indicator

---

### 3.1.2 Sign In ✅ MOSTLY COMPLETE

| Requirement | Status | Notes |
|------------|--------|-------|
| Login with email + password | ✅ | Working |
| Display error for incorrect credentials | ✅ | Shows "Invalid credentials" |
| Redirect to dashboard on success | ✅ | Role-based redirect |

**Status**: ✅ Fully implemented

---

## 3.2 Dashboard

### 3.2.1 Employee Dashboard ⚠️ NEEDS ENHANCEMENT

#### Required Quick-Access Cards:
| Card | Status | Location |
|------|--------|----------|
| Profile | ✅ | Link in navigation |
| Attendance | ✅ | Separate page |
| Leave Requests | ✅ | Separate page |
| Logout | ✅ | In user menu |

**Current Implementation:**
- Dashboard shows stats cards (attendance summary, leave balance)
- Has action buttons for clock in/out and apply leave
- Shows recent activity timeline

**Issue:** Cards are not "quick-access" in the traditional sense (clickable cards that navigate)

#### Recent Activity/Alerts:
- ✅ Shows recent attendance records
- ✅ Shows leave status
- ⚠️ No system alerts/notifications

---

### 3.2.2 Admin / HR Dashboard ⚠️ NEEDS ENHANCEMENT

#### Required Features:
| Feature | Status | Notes |
|---------|--------|-------|
| Employee list | ✅ | Available via Employees page |
| Attendance records | ✅ | Available via Attendance page |
| Leave approvals | ✅ | Available via Leave page |
| Switch between employees | ❌ | No dropdown/switcher on dashboard |

**Current Implementation:**
- Dashboard shows overview stats
- Pending approvals widget
- Each feature has dedicated page

**Missing:** Employee switcher/selector on dashboard itself

---

## 3.3 Employee Profile Management

### 3.3.1 View Profile ❌ INCOMPLETE

#### Required Profile Sections:
| Section | Required Fields | Status | Notes |
|---------|----------------|--------|-------|
| **Personal Details** | Name, Email, Phone, Address | ✅ | Implemented |
| **Job Details** | Employee ID, Department, Role, Date of Joining | ✅ | Implemented |
| **Salary Structure** | Base salary, Allowances, Deductions | ❌ | Employees cannot view their salary |
| **Documents** | Upload/view documents | ❌ | Not implemented |
| **Profile Picture** | Upload/change picture | ⚠️ | Field exists, upload not implemented |

**Critical Issues:**

#### 1. Salary Structure - MISSING ❌
**Current State:**
- Payroll model exists in backend
- Route: `GET /api/payroll/my` exists
- Frontend: Employees cannot access salary page

**Required:**
- Add salary view section in employee profile
- Show: Base salary, bonuses, deductions, net salary
- Display pay period and currency

#### 2. Documents Section - MISSING ❌
**Not Implemented:**
- No document model
- No file upload system
- No document storage

**Required Implementation:**
- Create Document model (type, file path, upload date)
- Add file upload API endpoints
- Add document viewer in profile
- Support multiple document types (ID proof, certificates, contracts)

#### 3. Profile Picture Upload - PARTIAL ⚠️
**Current:**
- User model has `profileImage` field
- Frontend shows avatar
- No actual upload functionality

**Required:**
- File upload API endpoint
- Image upload component
- Image preview
- File size/type validation

---

## 📊 Summary - Section 3 Compliance

### Overall Status: 60% Complete

| Section | Completion | Critical Issues |
|---------|-----------|-----------------|
| 3.1.1 Sign Up | 50% | Missing: Employee ID input, role selection, email verification, strong password rules |
| 3.1.2 Sign In | 100% | ✅ Complete |
| 3.2.1 Employee Dashboard | 80% | Minor: Quick-access card structure |
| 3.2.2 Admin Dashboard | 85% | Missing: Employee switcher |
| 3.3.1 View Profile | 40% | Missing: Salary view, Documents, Profile picture upload |

---

## 🔧 Required Fixes - Priority Order

### HIGH PRIORITY (Critical for Compliance)

1. **Email Verification System**
   - Add verification token to User model
   - Implement email sending service
   - Create verification endpoint
   - Add email verification check on login

2. **Employee Salary View**
   - Add salary section to employee profile page
   - Fetch from `/api/payroll/my` endpoint
   - Display: base, allowances, deductions, net

3. **Password Security Rules**
   - Enhance validation: uppercase, number, special char
   - Update both backend and frontend
   - Show real-time strength indicator

4. **Documents Management**
   - Create Document model
   - Implement file upload system
   - Add document viewer to profile

### MEDIUM PRIORITY

5. **Profile Picture Upload**
   - Implement image upload endpoint
   - Add file upload component
   - Handle image storage (local or cloud)

6. **Role Selection in Signup**
   - Add role dropdown in signup form
   - Admin can approve role requests
   - Or make HR role admin-assignable only

7. **Employee ID Input**
   - Make Employee ID a user input field
   - Validate uniqueness
   - Or clarify if auto-generation is acceptable

### LOW PRIORITY

8. **Dashboard Enhancements**
   - Make cards more clickable/actionable
   - Add employee switcher for admin
   - Add notification/alert system

---

## 📝 Files That Need Updates

### Backend:
- [ ] `models/User.js` - Add email verification fields
- [ ] `models/Document.js` - CREATE NEW
- [ ] `controllers/authController.js` - Add email verification logic
- [ ] `controllers/documentController.js` - CREATE NEW
- [ ] `middleware/validate.js` - Enhance password rules
- [ ] `routes/documentRoutes.js` - CREATE NEW
- [ ] `utils/emailService.js` - CREATE NEW

### Frontend:
- [ ] `pages/auth/Signup.jsx` - Add employee ID, role selection, better password validation
- [ ] `pages/employee/EmployeeProfile.jsx` - Add salary section, documents section, image upload
- [ ] `components/profile/SalaryView.jsx` - CREATE NEW
- [ ] `components/profile/DocumentManager.jsx` - CREATE NEW
- [ ] `components/profile/ProfilePictureUpload.jsx` - CREATE NEW

---

## 🎯 Recommendations

### Option 1: Full Compliance (Recommended for Production)
Implement all missing features to be 100% spec-compliant.

### Option 2: Modified Spec (Faster, with justification)
- Keep Employee ID as auto-generated (explain in docs)
- Email verification as "planned feature"
- Implement critical features: salary view, documents
- Document deviations with business justification

### Option 3: Phased Approach
**Phase 1 (Immediate):**
- Enhanced password validation
- Employee salary view
- Profile picture upload

**Phase 2 (Next Sprint):**
- Document management system
- Email verification

**Phase 3 (Future):**
- Advanced dashboard features
- Role selection in signup

---

**Next Steps:** Choose approach and prioritize implementation based on deadline and resources.
