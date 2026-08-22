# HRMS - Human Resource Management System

A full-stack HRMS application with employee management, attendance tracking, leave management, and payroll features.

## 🚀 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 19 with Vite
- React Router DOM v7
- Tailwind CSS
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons
- TanStack React Query for data fetching

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd OdooHackathon
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string for JWT signing
# - PORT: Server port (default: 5000)
# - FRONTEND_URL: Frontend URL for CORS (default: http://localhost:5173)
```

**Example .env configuration:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrms_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend/hrms-frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# The .env file should contain:
# VITE_API_URL=http://localhost:5000/api
```

## 🚦 Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# Or using mongod
mongod --dbpath <path-to-your-data-directory>
```

### Start Backend Server
```bash
# From the backend directory
cd backend

# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The backend server will start on `http://localhost:5000`

### Start Frontend Development Server
```bash
# From the frontend directory
cd frontend/hrms-frontend

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 👥 Default Users

The system comes with pre-configured users for testing:

### Admin Account
- **Email:** admin@hrms.com
- **Password:** admin123
- **Role:** Admin (full access)

### Employee Account
- **Email:** john.doe@hrms.com
- **Password:** password123
- **Role:** Employee (limited access)

## 📁 Project Structure

### Backend Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth, validation, error)
├── models/          # MongoDB models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

### Frontend Structure
```
frontend/hrms-frontend/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and icons
│   ├── components/  # Reusable components
│   ├── context/     # React context providers
│   ├── data/        # Mock data (for development)
│   ├── hooks/       # Custom React hooks
│   ├── layout/      # Layout components
│   ├── pages/       # Page components
│   ├── routes/      # Route configuration
│   ├── services/    # API service layer
│   ├── utils/       # Utility functions
│   ├── App.jsx      # Main app component
│   └── main.jsx     # Entry point
└── vite.config.js   # Vite configuration
```

## 🔑 Key Features

### For All Users
- ✅ User authentication (login/signup)
- ✅ Profile management
- ✅ Dashboard with analytics

### For Employees
- ✅ Clock in/out functionality
- ✅ View attendance history
- ✅ Apply for leave
- ✅ View leave status
- ✅ View employee directory

### For Admins/HR
- ✅ Manage all employees
- ✅ View all attendance records
- ✅ Approve/reject leave requests
- ✅ Manage payroll and salaries
- ✅ View comprehensive analytics
- ✅ Add/edit/delete users

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID

### Attendance
- `GET /api/attendance/my-attendance` - Get my attendance
- `GET /api/attendance/today` - Get today's attendance
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out

### Leave
- `GET /api/leave/my-leaves` - Get my leave requests
- `POST /api/leave/apply` - Apply for leave

### Admin Routes
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/attendance` - Get all attendance
- `GET /api/admin/leaves` - Get all leave requests
- `PUT /api/admin/leaves/:id` - Approve/reject leave
- `GET /api/admin/payroll` - Get all payroll
- `GET /api/admin/stats` - Get dashboard statistics

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend/hrms-frontend
npm run lint
```

## 🏗️ Building for Production

### Backend
```bash
cd backend
# Set NODE_ENV to production in .env
npm start
```

### Frontend
```bash
cd frontend/hrms-frontend
npm run build
# Built files will be in the 'dist' directory
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your `MONGODB_URI` in the backend `.env` file
- Verify network connectivity if using MongoDB Atlas

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that the backend server is running
- Clear browser cache and cookies

### Authentication Issues
- Clear localStorage in browser developer tools
- Verify JWT_SECRET is set in backend `.env`
- Check that the token is being sent in request headers

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change the PORT in backend .env file
```

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/hrms_db |
| JWT_SECRET | Secret for JWT signing | your_secret_key |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created for Odoo Hackathon

## 📞 Support

For issues and questions, please create an issue in the repository.
