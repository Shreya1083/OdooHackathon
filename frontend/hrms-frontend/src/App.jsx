import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ── Context ──────────────────────────────────────────────────────────────────
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute   from './routes/ProtectedRoute.jsx';

// ── Layout ───────────────────────────────────────────────────────────────────
import MainLayout from './layout/MainLayout.jsx';

// ── Auth pages ────────────────────────────────────────────────────────────────
import Login  from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';

// ── Employee pages ────────────────────────────────────────────────────────────
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';
import Employees         from './pages/employee/Employees.jsx';
import EmployeeProfile   from './pages/employee/EmployeeProfile.jsx';
import Attendance        from './pages/employee/Attendance.jsx';
import Leave             from './pages/employee/Leave.jsx';

// ── Admin / HR pages ──────────────────────────────────────────────────────────
import AdminDashboard  from './pages/admin/AdminDashboard.jsx';
import AdminEmployees  from './pages/admin/AdminEmployees.jsx';
import AdminAttendance from './pages/admin/AdminAttendance.jsx';
import AdminLeave      from './pages/admin/AdminLeave.jsx';
import AdminSalary     from './pages/admin/AdminSalary.jsx';
import AdminProfile    from './pages/admin/AdminProfile.jsx';

// ── 404 ───────────────────────────────────────────────────────────────────────
import NotFound from './pages/NotFound.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Smart root redirect — sends user to the right dashboard after hydration
// ─────────────────────────────────────────────────────────────────────────────
import { useAuth } from './context/AuthContext.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  if (!user)   return <Navigate to="/login" replace />;
  if (user.role === 'admin' || user.role === 'hr') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
}

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              fontSize: '0.875rem',
              borderRadius: '10px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f8fafc' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f8fafc' },
            },
          }}
        />

        <Routes>
          {/* ── Root ── */}
          <Route path="/" element={<RootRedirect />} />

          {/* ── Public auth routes ── */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── Employee routes ─────────────────────────────────────────────── */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={['employee', 'hr']} redirectTo="/admin/dashboard">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Default: redirect /employee → /employee/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"       element={<EmployeeDashboard />} />
            <Route path="employees"       element={<Employees />} />
            <Route path="employees/:id"   element={<EmployeeProfile />} />
            <Route path="attendance"      element={<Attendance />} />
            <Route path="leave"           element={<Leave />} />
            <Route path="profile"         element={<EmployeeProfile />} />
          </Route>

          {/* ── Admin/HR routes ────────────────────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr']} redirectTo="/employee/dashboard">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"       element={<AdminDashboard />} />
            <Route path="employees"       element={<AdminEmployees />} />
            <Route path="employees/:id"   element={<EmployeeProfile />} />
            <Route path="attendance"      element={<AdminAttendance />} />
            <Route path="leave"           element={<AdminLeave />} />
            <Route path="salary"          element={<AdminSalary />} />
            <Route path="profile"         element={<AdminProfile />} />
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
