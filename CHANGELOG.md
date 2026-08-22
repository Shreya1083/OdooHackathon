# Changelog

All notable changes to the HRMS project will be documented in this file.

## [Unreleased]

### Added - 2026-08-22

#### Backend
- ✅ Created `.env.example` with all required environment variables
- ✅ Enhanced CORS configuration with credentials support and origin whitelisting
- ✅ Environment variable validation on server startup
- ✅ Comprehensive error handling middleware
- ✅ JWT-based authentication system
- ✅ Role-based access control (Admin, HR, Employee)
- ✅ Attendance management (clock in/out)
- ✅ Leave management system with approval workflow
- ✅ Payroll management (admin/HR only)
- ✅ User profile management
- ✅ MongoDB integration with Mongoose ODM
- ✅ Password hashing with bcryptjs
- ✅ Request validation middleware

#### Frontend
- ✅ Replaced mock API with real backend integration
- ✅ Created `apiClient.js` with axios interceptors for:
  - Automatic token attachment to requests
  - Global error handling
  - Automatic 401 redirect to login
- ✅ Updated `api.js` to consume real backend endpoints
- ✅ Fixed axios package version to 1.7.0 (was incorrectly set to 1.19.0)
- ✅ Created `.env` and `.env.example` for environment configuration
- ✅ Updated `AuthContext.jsx` to use token-based authentication
- ✅ Added `.env` files to `.gitignore`
- ✅ React 19 with Vite build system
- ✅ Tailwind CSS for styling with custom design system
- ✅ React Router DOM v7 for navigation
- ✅ Protected routes with role-based access
- ✅ Toast notifications for user feedback
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Employee dashboard with stats and quick actions
- ✅ Admin dashboard with comprehensive analytics
- ✅ Attendance tracking interface
- ✅ Leave application and management
- ✅ Employee directory
- ✅ Profile management

#### Documentation
- ✅ Created comprehensive `README.md` with:
  - Tech stack overview
  - Installation instructions
  - Project structure
  - API endpoint documentation
  - Troubleshooting guide
- ✅ Created `QUICK_START.md` for rapid setup
- ✅ Created `DEPLOYMENT.md` with production deployment guides for:
  - Heroku
  - Railway
  - VPS (Ubuntu with Nginx)
  - Vercel (frontend)
  - Netlify (frontend)
  - Security best practices
  - MongoDB production setup
  - Monitoring and maintenance
  - Backup strategies
- ✅ Created this `CHANGELOG.md`

### Fixed
- ✅ Axios version incompatibility (1.19.0 → 1.7.0)
- ✅ CORS configuration for production environments
- ✅ Authentication token storage and retrieval
- ✅ Environment variable handling in frontend (Vite env vars)

### Security
- ✅ JWT secret validation on startup
- ✅ Password hashing before storage
- ✅ Protected routes with authentication middleware
- ✅ Role-based authorization checks
- ✅ CORS configuration to prevent unauthorized access
- ✅ Secure HTTP-only token handling recommendations
- ✅ Environment variables excluded from version control

## [1.0.0] - Initial Release

### Features
- User authentication and authorization
- Employee management
- Attendance tracking
- Leave management
- Payroll system
- Dashboard analytics
- Profile management
- Responsive UI

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

#### Attendance
- `GET /api/attendance/my-attendance` - Get user's attendance records
- `GET /api/attendance/today` - Get today's attendance
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out

#### Leave
- `GET /api/leave/my-leaves` - Get user's leave requests
- `POST /api/leave/apply` - Apply for leave

#### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user (admin)
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/attendance` - Get all attendance records
- `GET /api/admin/leaves` - Get all leave requests
- `PUT /api/admin/leaves/:id` - Approve/reject leave
- `GET /api/admin/payroll` - Get all payroll records
- `GET /api/admin/stats` - Get dashboard statistics

#### Payroll
- `GET /api/payroll/:employeeId` - Get employee payroll
- `PUT /api/payroll/:employeeId` - Update payroll

---

## Types of Changes
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities

---

## Migration Notes

### From Mock Data to Real Backend

If you're upgrading from an earlier version that used mock data:

1. **Backend Setup Required**
   - Install and configure MongoDB
   - Set up backend environment variables
   - Run backend server

2. **Frontend Updates**
   - Delete old `src/services/api.js` (mock version)
   - Update to new `api.js` and `apiClient.js`
   - Create `.env` file with `VITE_API_URL`
   - Clear browser localStorage

3. **Data Migration**
   - Previous mock data in localStorage will be cleared
   - Create new user accounts via registration
   - Admin will need to reconfigure settings

---

## Roadmap

### Planned Features
- [ ] Email notifications for leave approval/rejection
- [ ] Employee performance reviews
- [ ] Document management system
- [ ] Shift scheduling
- [ ] Timesheet management
- [ ] Export reports (PDF, Excel)
- [ ] Multi-language support
- [ ] Two-factor authentication
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Biometric attendance integration
- [ ] Salary slip generation
- [ ] Tax calculation
- [ ] Holiday calendar management
- [ ] Department-wise analytics

### Under Consideration
- Integration with third-party HR tools
- API for external integrations
- Customizable workflows
- Advanced permission system
- Audit logs
- Real-time notifications with WebSockets

---

For more details, see [README.md](README.md)
