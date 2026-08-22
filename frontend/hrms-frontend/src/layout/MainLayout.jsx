import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Clock, CalendarDays, DollarSign,
  LogOut, User, ChevronDown, Menu, Bell, Settings,
  UserCheck, ClipboardList,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/common/Avatar.jsx';
import toast from 'react-hot-toast';

// ── Per-role nav items ────────────────────────────────────────────────────────
const NAV_EMPLOYEE = [
  { to: '/employee/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/employee/employees',  label: 'Employees',   icon: Users },
  { to: '/employee/attendance', label: 'Attendance',  icon: Clock },
  { to: '/employee/leave',      label: 'Time Off',    icon: CalendarDays },
];

const NAV_ADMIN = [
  { to: '/admin/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/admin/employees',    label: 'Employees',      icon: Users },
  { to: '/admin/attendance',   label: 'Attendance',     icon: UserCheck },
  { to: '/admin/leave',        label: 'Leave Requests', icon: ClipboardList },
  { to: '/admin/salary',       label: 'Payroll',        icon: DollarSign },
];

function NavItem({ item, collapsed, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon size={18} className="flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

function ProfileDropdown({ user, onClose }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const ref        = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  async function handleLogout() {
    onClose();
    await logout();
    toast.success('Signed out successfully');
    navigate('/login', { replace: true });
  }

  const profilePath = user.role === 'employee' ? '/employee/profile' : '/admin/profile';

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-card-xl border border-surface-200 py-1.5 z-50 animate-fade-in"
    >
      {/* User info header */}
      <div className="px-3.5 py-2.5 border-b border-surface-100 mb-1">
        <p className="text-sm font-semibold text-surface-900">{user.firstName} {user.lastName}</p>
        <p className="text-xs text-surface-400 mt-0.5 capitalize">{user.role}</p>
      </div>

      <Link
        to={profilePath}
        onClick={onClose}
        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-surface-900 transition-colors"
      >
        <User size={15} />
        My Profile
      </Link>

      {(user.role === 'admin') && (
        <Link
          to="/admin/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-surface-900 transition-colors"
        >
          <Settings size={15} />
          Settings
        </Link>
      )}

      <div className="border-t border-surface-100 mt-1 pt-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function MainLayout() {
  const { user, isAdmin } = useAuth();
  const navItems = isAdmin ? NAV_ADMIN : NAV_EMPLOYEE;

  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-surface-200
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 h-16 px-4 border-b border-surface-100 flex-shrink-0 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-base text-surface-900 tracking-tight">HRMS Pro</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              item={item}
              collapsed={sidebarCollapsed}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* Bottom: user mini + collapse toggle */}
        <div className="border-t border-surface-100 p-2 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-surface-50 mb-2">
              <Avatar user={user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-800 truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-surface-400 capitalize truncate">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed
              ? <ChevronDown size={16} className="-rotate-90" />
              : <ChevronDown size={16} className="rotate-90" />
            }
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Top navbar ── */}
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-20">
          {/* Left: hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn-icon text-surface-500 hover:text-surface-700"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-bold text-sm text-surface-900">HRMS Pro</span>
          </div>

          {/* Right: notifications + profile */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Notification bell (placeholder) */}
            <button className="btn-icon text-surface-500 hover:text-surface-700 relative" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Profile button */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-surface-100 transition-colors"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <Avatar user={user} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-surface-700">
                  {user.firstName}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-surface-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {profileOpen && (
                <ProfileDropdown user={user} onClose={() => setProfileOpen(false)} />
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
