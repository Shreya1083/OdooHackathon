# 🔓 Login & Signup Guide - FIXED!

## ✅ ISSUE RESOLVED

**Problem:** JWT token generation was missing the `JWT_EXPIRE` environment variable.  
**Solution:** Added `JWT_EXPIRE=30d` to the `.env` file and updated the token generator with a fallback.

---

## 🚀 Both Servers Are Now Running

✅ **Backend:** http://localhost:5000 (MongoDB connected)  
✅ **Frontend:** http://localhost:5173

---

## 🔐 Use These Working Credentials

### 👑 ADMIN
```
Email: admin@hrms.com
Password: Admin@123
```

### 👔 HR OFFICER
```
Email: hr@hrms.com
Password: HrOfficer@123
```

### 👤 EMPLOYEE
```
Email: alice@hrms.com
Password: Employee@123
```

---

## 📝 Creating a New Account (Signup)

### Step 1: Go to Signup Page
http://localhost:5173/signup

### Step 2: Use a Valid Password
Your password MUST include ALL of these:
- ✅ **8+ characters**
- ✅ **1 uppercase letter** (A-Z)
- ✅ **1 lowercase letter** (a-z)
- ✅ **1 number** (0-9)
- ✅ **1 special character** (!@#$%^&*(),.?":{}|<>)

### Valid Password Examples:
```
✅ MyPassword@123
✅ SecurePass#2024
✅ Welcome$2026
✅ TestUser@456
```

### Invalid Password Examples:
```
❌ password123      (no uppercase, no special char)
❌ PASSWORD@        (no lowercase, no number)
❌ MyPass1          (no special character)
❌ Test@1           (too short - less than 8 chars)
```

### Step 3: Fill Out the Form
```
First Name: John
Last Name: Doe
Username: johndoe
Email: john@company.com
Phone: +1-555-1234 (optional)
Password: MyPassword@123
Confirm Password: MyPassword@123
```

### Step 4: Click "Create Account"

---

## 🎯 Quick Test Steps

### Test Login (EASIEST):
1. Go to http://localhost:5173/login
2. Click one of the **Demo Account Buttons**:
   - **Employee** button
   - **HR Officer** button  
   - **Admin** button
3. Click "Sign in"
4. ✅ You're logged in!

### Test Signup:
1. Go to http://localhost:5173/signup
2. Use this exact data:
   ```
   First Name: Test
   Last Name: User
   Username: testuser
   Email: test@example.com
   Password: TestUser@123
   Confirm: TestUser@123
   ```
3. Click "Create Account"
4. ✅ Account created! You'll be logged in automatically

---

## ❌ Common Errors & Solutions

### Error: "expiresIn should be a number..."
**Status:** ✅ FIXED! Backend has been updated.

### Error: "Invalid credentials"
**Solution:** 
- Make sure you're using the EXACT email and password
- Passwords are case-sensitive
- Try copy-pasting from this guide

### Error: "User already exists"
**Solution:** 
- That email is already registered
- Try logging in instead
- Or use a different email

### Error: "Password does not meet security requirements"
**Solution:**
- Check your password includes ALL requirements (listed above)
- Use one of the example passwords from this guide

### Error: "Network Error" or "Failed to fetch"
**Solution:**
- Make sure backend is running on port 5000
- Check the terminal for errors
- Try refreshing the page

---

## 🔄 If Nothing Works - Full Reset

### 1. Stop All Servers
Close all terminal windows

### 2. Kill Node Processes
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 3. Reset Database (if needed)
```bash
cd backend
node scripts/seedUsers.js
```

### 4. Start Backend
```bash
cd backend
npm run dev
```
Wait until you see: `✅ MongoDB Connected`

### 5. Start Frontend  
```bash
cd frontend/hrms-frontend
npm run dev
```
Wait until you see: `Local: http://localhost:5173/`

### 6. Try Login Again
Go to http://localhost:5173/login and use demo credentials

---

## 🎉 Success Checklist

After logging in successfully, you should see:

**For Admin (`admin@hrms.com`):**
- ✅ Admin Dashboard
- ✅ Sidebar with Employees, Attendance, Leave, Salary
- ✅ Stats showing system data
- ✅ User menu in top right

**For HR Officer (`hr@hrms.com`):**
- ✅ Admin Dashboard (same as admin)
- ✅ Can approve leaves and view payroll
- ✅ Cannot delete users (admin only)

**For Employee (`alice@hrms.com`):**
- ✅ Employee Dashboard
- ✅ Your own stats
- ✅ Clock in/out buttons
- ✅ Apply for leave option

---

## 📞 Still Having Issues?

1. Check backend logs in terminal
2. Check browser console (F12 → Console tab)
3. Make sure MongoDB is running
4. Try clearing browser cache
5. Make sure you're using the correct ports (5000 for backend, 5173 for frontend)

---

## 🎯 Pro Tips

1. **Use Demo Buttons:** The fastest way to login is clicking the demo account buttons on the login page

2. **Password Manager:** For testing, use simple passwords like `TestUser@123` that meet all requirements

3. **Multiple Accounts:** You can create as many accounts as you want, just use different emails

4. **Role Testing:** To test admin features, login as admin. To test employee features, login as alice.

---

**Status:** ✅ All systems operational  
**Last Updated:** Just now  
**Backend:** Running on port 5000  
**Frontend:** Running on port 5173
