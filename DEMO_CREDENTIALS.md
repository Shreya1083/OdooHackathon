# 🔐 HRMS Demo Credentials

## Demo Accounts

### 👑 Admin Account
```
Email: admin@hrms.com
Password: Admin@123
Role: Admin
Access: Full system access
```
**Can do:**
- Manage all employees
- Approve/reject leave requests
- View all attendance records
- Manage payroll for all employees
- Edit user details
- View all system data

---

### 👔 HR Officer Account
```
Email: hr@hrms.com
Password: HrOfficer@123
Role: HR Officer
Access: HR management access
```
**Can do:**
- Approve/reject leave requests
- View all attendance records
- Manage payroll
- View all employees
- Cannot delete users (admin only)

---

### 👤 Employee Account
```
Email: alice@hrms.com
Password: Employee@123
Role: Employee
Access: Personal records only
```
**Can do:**
- View own profile
- Clock in/out for attendance
- Apply for leave
- View own salary (read-only)
- View own attendance history

---

## Additional Employee Accounts

### Employee 2:
```
Email: bob@hrms.com
Password: Employee@123
Department: Sales
```

### Employee 3:
```
Email: carol@hrms.com
Password: Employee@123
Department: Marketing
```

---

## 📝 Creating New Accounts

If you want to create a new account through signup:

### Password Requirements:
- ✅ At least **8 characters**
- ✅ At least **1 uppercase letter** (A-Z)
- ✅ At least **1 lowercase letter** (a-z)
- ✅ At least **1 number** (0-9)
- ✅ At least **1 special character** (!@#$%^&*(),.?":{}|<>)

### Valid Password Examples:
- `MyPass@123`
- `Welcome#2024`
- `Secure$Pass1`
- `Employee@123`

### Invalid Password Examples:
- `password` ❌ (no uppercase, number, special char)
- `PASSWORD` ❌ (no lowercase, number, special char)
- `Pass123` ❌ (no special character)
- `Pass@` ❌ (too short, no number)

---

## 🔄 Resetting Database

If you need to reset all users and recreate demo accounts:

```bash
cd backend
node scripts/seedUsers.js
```

This will:
1. Delete all existing users
2. Create fresh demo accounts
3. Display credentials in terminal

---

## 🚫 Troubleshooting Login Issues

### Issue: "Invalid credentials"
**Solution:** Make sure you're using the exact email and password (case-sensitive)

### Issue: "Account has been deactivated"
**Solution:** Contact admin or re-run the seed script

### Issue: Signup fails with "Password does not meet security requirements"
**Solution:** Your password must meet ALL requirements listed above

### Issue: "User already exists"
**Solution:** Use a different email address or try logging in instead

---

## 🎯 Quick Login Guide

1. **Go to:** http://localhost:5173/login
2. **Choose an account** from the demo buttons or enter credentials manually
3. **Click "Sign in"**
4. **You'll be redirected** to your dashboard based on your role:
   - Admin/HR → Admin Dashboard
   - Employee → Employee Dashboard

---

## 📱 Testing Different Roles

### Test Admin Features:
1. Login as admin@hrms.com
2. Go to Employees page
3. Try editing a user
4. Approve/reject leave requests

### Test HR Features:
1. Login as hr@hrms.com
2. View attendance records
3. Manage payroll
4. Approve leaves

### Test Employee Features:
1. Login as alice@hrms.com
2. Clock in for attendance
3. Apply for leave
4. View your profile

---

## 🔒 Security Notes

- Demo passwords are for **testing only**
- In production, users should create **strong unique passwords**
- Passwords are **hashed** using bcrypt before storage
- JWT tokens are used for **session management**
- Tokens expire after a set period

---

## 📞 Need Help?

If you have any issues:
1. Check that MongoDB is running
2. Check that backend server is running on port 5000
3. Check that frontend is running on port 5173
4. Clear browser localStorage and try again
5. Re-run the seed script to reset users

---

**Last Updated:** 2026-08-22  
**System:** HRMS Pro v1.0
