# 🚀 Quick Start Guide

Get the HRMS system up and running in 5 minutes!

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend/hrms-frontend
npm install
```

## Step 2: Configure Environment

### Backend Configuration
```bash
cd backend
copy .env.example .env
```

Edit `.env` with your settings:
```env
MONGODB_URI=mongodb://localhost:27017/hrms_db
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration
```bash
cd frontend/hrms-frontend
copy .env.example .env
```

The default `.env` should work:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB

### Windows
```bash
net start MongoDB
```

### macOS/Linux
```bash
mongod
```

### Using MongoDB Atlas (Cloud)
Update the `MONGODB_URI` in backend `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms_db
```

## Step 4: Start the Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend/hrms-frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

## Step 5: Login & Test

Open your browser and go to: **http://localhost:5173**

### Test Credentials

**Admin Account:**
- Email: `admin@hrms.com`
- Password: `admin123`

**Employee Account:**
- Email: `john.doe@hrms.com`
- Password: `password123`

## 🎉 You're Ready!

Now you can:
- Clock in/out as an employee
- Apply for leave
- Manage employees as admin
- View attendance and payroll

## ⚠️ Common Issues

### "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check your connection string in `.env`

### "Port 5000 already in use"
- Change PORT in backend `.env` to 5001 or another port
- Update VITE_API_URL in frontend `.env` accordingly

### "CORS error"
- Verify backend is running
- Check FRONTEND_URL in backend `.env` matches your frontend

### "Token invalid"
- Clear browser localStorage
- Try logging in again

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for API details
- Review the code structure to customize features
