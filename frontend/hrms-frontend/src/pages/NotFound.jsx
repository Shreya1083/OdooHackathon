import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const homeLink = !user
    ? '/login'
    : user.role === 'employee'
    ? '/employee/dashboard'
    : '/admin/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-9xl font-black text-surface-100 select-none leading-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center">
              <span className="text-brand-600 font-bold text-3xl">!</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-surface-900 mb-2">Page not found</h1>
        <p className="text-surface-500 text-sm mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist or you don&apos;t have permission to access it.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary gap-2">
            <ArrowLeft size={16} /> Go back
          </button>
          <Link to={homeLink} className="btn-primary gap-2">
            <Home size={16} /> Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
