import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, CalendarDays, Clock,
  ArrowRight, CheckCircle2,
  AlertCircle, Activity,
} from 'lucide-react';
import {
  apiGetAdminStats,
  apiGetAllLeaves,
  apiGetAllAttendance,
  apiGetAllUsers,
} from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { formatDate, getDepartmentColor } from '../../utils/helpers.js';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, iconBg, iconColor, linkTo, linkLabel }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} className={iconColor} />
        </div>
        {linkTo && (
          <Link to={linkTo} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-0.5 mt-1">
            {linkLabel || 'View'} <ArrowRight size={11} />
          </Link>
        )}
      </div>
      <p className="text-3xl font-bold text-surface-900 mt-3">{value ?? '—'}</p>
      <p className="text-sm font-medium text-surface-700 mt-0.5">{title}</p>
      {sub && <p className="text-xs text-surface-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Department breakdown bar ──────────────────────────────────────────────────
function DeptBar({ dept, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className={`badge text-xs w-28 justify-center ${getDepartmentColor(dept)}`}>{dept}</span>
      <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-surface-600 w-8 text-right">{count}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats,    setStats]    = useState(null);
  const [leaves,   setLeaves]   = useState([]);
  const [attend,   setAttend]   = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, l, a, u] = await Promise.all([
          apiGetAdminStats(),
          apiGetAllLeaves(),
          apiGetAllAttendance(),
          apiGetAllUsers(),
        ]);
        setStats(s);
        setLeaves(l);
        setAttend(a);
        setUsers(u);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard…" />;

  const employees    = users.filter((u) => u.role === 'employee');
  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const todayStr     = new Date().toISOString().split('T')[0];
  const todayAttend  = attend.filter((a) => a.date === todayStr);

  // Dept breakdown
  const deptMap = {};
  employees.forEach((e) => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptEntries = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

  // Recent activities (merge leaves + attendance, sort by date)
  const recentLeaves = leaves.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-surface-800 to-surface-900 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 right-24 w-36 h-36 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-surface-400 text-sm font-medium uppercase tracking-wide mb-1">
              {user.role === 'admin' ? 'Admin' : 'HR Officer'} Panel
            </p>
            <h1 className="text-xl font-bold">Welcome back, {user.firstName}!</h1>
            <p className="text-surface-300 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
              <p className="text-2xl font-bold">{todayAttend.length}</p>
              <p className="text-xs text-surface-300">Present Today</p>
            </div>
            <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
              <p className="text-2xl font-bold text-amber-300">{pendingLeaves.length}</p>
              <p className="text-xs text-surface-300">Pending Leaves</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees" value={stats?.totalEmployees}
          sub="Active staff" icon={Users}
          iconBg="bg-brand-100" iconColor="text-brand-600"
          linkTo="/admin/employees" linkLabel="Manage"
        />
        <StatCard
          title="Present Today" value={stats?.presentToday}
          sub={`of ${stats?.totalEmployees} employees`} icon={UserCheck}
          iconBg="bg-emerald-100" iconColor="text-emerald-600"
          linkTo="/admin/attendance" linkLabel="View"
        />
        <StatCard
          title="Pending Leaves" value={stats?.pendingLeaves}
          sub="Awaiting review" icon={CalendarDays}
          iconBg="bg-amber-100" iconColor="text-amber-600"
          linkTo="/admin/leave" linkLabel="Review"
        />
        <StatCard
          title="Approved Leaves" value={stats?.approvedLeaves}
          sub="This period" icon={CheckCircle2}
          iconBg="bg-purple-100" iconColor="text-purple-600"
          linkTo="/admin/leave"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending leave requests */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" />
              <h2 className="font-semibold text-surface-900 text-sm">Pending Leave Requests</h2>
              {pendingLeaves.length > 0 && (
                <span className="badge-pending">{pendingLeaves.length}</span>
              )}
            </div>
            <Link to="/admin/leave" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              Manage all <ArrowRight size={12} />
            </Link>
          </div>

          {pendingLeaves.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 size={32} className="text-emerald-400 mb-2" />
              <p className="text-sm text-surface-500 font-medium">All caught up!</p>
              <p className="text-xs text-surface-400">No pending leave requests</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-50">
              {pendingLeaves.slice(0, 5).map((leave) => (
                <div key={leave.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-brand-700">
                    {leave.employeeName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-800">{leave.employeeName}</p>
                    <p className="text-xs text-surface-400">
                      {leave.type} · {formatDate(leave.startDate)} – {formatDate(leave.endDate)} · {leave.duration}d
                    </p>
                  </div>
                  <Link to="/admin/leave" className="btn-warning btn-sm text-xs">Review</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department breakdown */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-surface-400" />
            <h2 className="font-semibold text-surface-900 text-sm">Team by Department</h2>
          </div>
          <div className="space-y-3">
            {deptEntries.map(([dept, count]) => (
              <DeptBar key={dept} dept={dept} count={count} total={employees.length} />
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-surface-100 flex justify-between text-xs text-surface-400">
            <span>Total Employees</span>
            <span className="font-bold text-surface-700">{employees.length}</span>
          </div>
        </div>
      </div>

      {/* Today's attendance + recent all-leave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's attendance */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-surface-400" />
              <h2 className="font-semibold text-surface-900 text-sm">Today's Attendance</h2>
            </div>
            <Link to="/admin/attendance" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              Full view <ArrowRight size={12} />
            </Link>
          </div>
          {todayAttend.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-surface-400">No clock-ins recorded today</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-50">
              {todayAttend.slice(0, 6).map((rec) => (
                <div key={rec.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-surface-800 flex-1">{rec.employeeName}</p>
                  <span className="text-xs text-surface-400">{rec.clockIn}</span>
                  {rec.clockOut
                    ? <span className="text-xs text-surface-400">{rec.clockOut}</span>
                    : <span className="badge badge-blue text-xs">Active</span>
                  }
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent leave activity */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-surface-400" />
              <h2 className="font-semibold text-surface-900 text-sm">Recent Leave Activity</h2>
            </div>
          </div>
          <div className="divide-y divide-surface-50">
            {recentLeaves.map((leave) => (
              <div key={leave.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{leave.employeeName}</p>
                  <p className="text-xs text-surface-400 truncate">{leave.type} · {leave.duration}d</p>
                </div>
                <StatusBadge status={leave.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
