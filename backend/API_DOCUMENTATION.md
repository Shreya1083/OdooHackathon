# 📚 HRMS API DOCUMENTATION

## 🔗 Base URL
```
http://localhost:5000/api
```

---

## 🔐 AUTHENTICATION

### 1. Signup
**POST** `/auth/signup`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee",
  "department": "IT",
  "phone": "1234567890",
  "address": "123 Street"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "employeeId": "EMP0001",
    "department": "IT",
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

---

### 2. Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "employeeId": "EMP0001",
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

---

### 3. Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 👤 USER PROFILE

### 1. Get Profile
**GET** `/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 2. Update Profile
**PUT** `/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "address": "456 New Street",
  "profileImage": "image_url"
}
```

---

## 📅 ATTENDANCE

### 1. Check In
**POST** `/attendance/checkin`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "date": "2026-08-22",
    "checkIn": "2026-08-22T09:00:00.000Z",
    "status": "present"
  },
  "message": "Checked in successfully"
}
```

---

### 2. Check Out
**POST** `/attendance/checkout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "date": "2026-08-22",
    "checkIn": "2026-08-22T09:00:00.000Z",
    "checkOut": "2026-08-22T18:00:00.000Z",
    "hours": 9,
    "status": "present"
  },
  "message": "Checked out successfully"
}
```

---

### 3. Get My Attendance
**GET** `/attendance/my?month=8&year=2026`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 4. Get All Attendance (Admin)
**GET** `/attendance/all?month=8&year=2026`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 5. Get Attendance By User (Admin)
**GET** `/attendance/user/:userId`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 📝 LEAVE MANAGEMENT

### 1. Apply Leave
**POST** `/leave/apply`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "type": "paid",
  "fromDate": "2026-08-25",
  "toDate": "2026-08-27",
  "reason": "Family function"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "type": "paid",
    "fromDate": "2026-08-25",
    "toDate": "2026-08-27",
    "days": 3,
    "reason": "Family function",
    "status": "pending"
  },
  "message": "Leave application submitted successfully"
}
```

---

### 2. Get My Leaves
**GET** `/leave/my`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 3. Get All Leaves (Admin)
**GET** `/leave/all?status=pending`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 4. Update Leave Status (Admin)
**PUT** `/leave/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "approved"
}
```

or for rejection:

```json
{
  "status": "rejected",
  "rejectionReason": "Not enough leave balance"
}
```

---

### 5. Delete Leave
**DELETE** `/leave/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 💰 PAYROLL

### 1. Get My Salary
**GET** `/payroll/my?month=8&year=2026`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 2. Get All Payrolls (Admin)
**GET** `/payroll/all?month=8&year=2026`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 3. Get Salary By User (Admin)
**GET** `/payroll/user/:userId`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 4. Create/Update Payroll (Admin)
**POST** `/payroll/create`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userId": "user_id_here",
  "month": "8",
  "year": 2026,
  "baseSalary": 50000,
  "bonus": 5000,
  "deductions": 2000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "month": "8",
    "year": 2026,
    "baseSalary": 50000,
    "bonus": 5000,
    "deductions": 2000,
    "netSalary": 53000,
    "workingDays": 31,
    "presentDays": 22,
    "leaveDays": 3,
    "status": "pending"
  },
  "message": "Payroll created/updated successfully"
}
```

---

### 5. Update Payroll Status (Admin)
**PUT** `/payroll/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "paid"
}
```

---

## 🧑‍💼 ADMIN

### 1. Get Dashboard Stats
**GET** `/admin/dashboard`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEmployees": 50,
    "activeEmployees": 48,
    "todayAttendance": 45,
    "pendingLeaves": 5,
    "monthlyPayroll": 2500000
  }
}
```

---

### 2. Get All Employees
**GET** `/admin/employees`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 3. Get Employee By ID
**GET** `/admin/employees/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 4. Update Employee
**PUT** `/admin/employees/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "department": "HR",
  "phone": "9876543210",
  "address": "New Address",
  "isActive": true
}
```

---

### 5. Delete Employee
**DELETE** `/admin/employees/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 🔑 Authentication Header Format

For all protected routes, include:

```
Authorization: Bearer <your_jwt_token>
```

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 📊 Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

---

## 🧪 Testing with Postman

1. Import these endpoints into Postman
2. Create environment variables:
   - `base_url` = `http://localhost:5000/api`
   - `token` = (set after login)
3. Use `{{base_url}}` and `{{token}}` in requests

---

## 🚀 Quick Start

1. **Signup as Admin:**
```json
POST /api/auth/signup
{
  "name": "Admin",
  "email": "admin@hrms.com",
  "password": "admin123",
  "role": "admin"
}
```

2. **Login:**
```json
POST /api/auth/login
{
  "email": "admin@hrms.com",
  "password": "admin123"
}
```

3. **Copy the token from response**

4. **Use token in Authorization header for all subsequent requests**

---

## 📝 Notes

- All dates should be in ISO format
- Tokens expire in 7 days (configurable in .env)
- Admin role required for admin routes
- Employee role for employee routes

---
