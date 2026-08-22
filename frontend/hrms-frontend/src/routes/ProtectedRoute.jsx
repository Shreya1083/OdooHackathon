import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Full-screen spinner used while session is hydrating
function SessionLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        <p className="text-sm text-surface-500">Loading session…</p>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles  - if omitted, any authenticated user passes
 * @param {string}   redirectTo    - where to send unauthorised users
 */
export default function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }) {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) return <SessionLoader />;

  // Not authenticated → login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role → 403 or home
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
