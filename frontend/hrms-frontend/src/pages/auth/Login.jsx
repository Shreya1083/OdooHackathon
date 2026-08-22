import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiLogin } from '../../services/api.js';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { label: 'Employee', email: 'alice@hrms.com', password: 'pass123',  color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { label: 'HR Officer', email: 'hr@hrms.com', password: 'hr123', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Admin',    email: 'admin@hrms.com', password: 'admin123', color: 'bg-purple-50 border-purple-200 text-purple-700' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname;

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  function getRedirect(role) {
    if (from && !from.startsWith('/login') && !from.startsWith('/signup')) return from;
    if (role === 'admin' || role === 'hr') return '/admin/dashboard';
    return '/employee/dashboard';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email.trim()) { setError('Email is required'); return; }
    if (!form.password)     { setError('Password is required'); return; }

    setLoading(true);
    try {
      const { user } = await apiLogin({ email: form.email.trim(), password: form.password });
      login(user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(getRedirect(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(acc) {
    setForm({ email: acc.email, password: acc.password });
    setError('');
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 relative overflow-hidden flex-col justify-between p-12">
        {/* background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/[0.03]" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">HRMS Pro</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Streamline your<br />HR operations
          </h1>
          <p className="text-brand-200 text-lg leading-relaxed">
            Manage attendance, leave requests, and employee records — all in one place.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-3">
          {['Role-based access control', 'Attendance & clock-in tracking', 'Leave management & approvals', 'Salary & payroll overview'].map((f) => (
            <div key={f} className="flex items-center gap-3 text-brand-100">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="font-bold text-xl text-surface-900">HRMS Pro</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-900">Sign in</h2>
            <p className="text-surface-500 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Quick demo login</p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-lg border transition-all duration-150 hover:opacity-90 ${acc.color}`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3 mb-5 animate-fade-in">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email or Username</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full btn-lg mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign in
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
