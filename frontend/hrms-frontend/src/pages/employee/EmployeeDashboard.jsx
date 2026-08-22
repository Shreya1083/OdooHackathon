import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Clock, CalendarDays, TrendingUp,
  ArrowRight, Search, Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiGetAllEmployees, apiGetMyAttendance, apiGetMyLeaves, apiGetTodayAttendance } from '../../services/api.js';
import Avatar from '../../components/common/Avatar.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { formatDate, getDepartmentColor } from '../../utils/helpers.js';

// ── Quick stat card ───────────────────────────────────────────────────────────
function QuickStat({ label, value, icon: Icon, bg, iconColor, sub }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <p className="text-xs font-medium text-surface-500">{label}</p>
        <p className="text-xl font-bold text-surface-900">{value}</p>
        {sub && <p className="text-xs text-surface-400">{sub}</p>}
      </div>
    </div>
  );
}

// ── Employee card ─────────────────────────────────────────────────────────────
function EmployeeCard({ employee }) {
  return (
    <Link
      to={`/employee/employees/${employee.id}`}
      className="card p-4 hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 block group"
    >
      <div className="flex items-start gap-3">
        <Avatar user={employee} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-surface-900 text-sm group-hover:text-brand-600 transition-colors truncate">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-xs text-surface-500 truncate mt-0.5">{employee.designation}</p>
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className={`badge text-xs ${getDepartmentColor(employee.department)}`}>
              <Building2 size={10} />
              {employee.department}
            </span>
          </div>
        </div>
        <ArrowRight size={14} className="text-surface-300 group-hover:text-brand-400 mt-0.5 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [employees,  setEmployees]  = useState([]);
  const [myLeaves,   setMyLeaves]   = useState([]);
  const [myAttend,   setMyAttend]   = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const [emps, leaves, attend, today] = await Promise.all([
          apiGetAllEmployees(),
          apiGetMyLeaves(),
          apiGetMyAttendance(),
          apiGetTodayAttendance(),
        ]);
        setEmployees(emps);
        setMyLeaves(leaves);
        setMyAttend(attend);
        setTodayRecord(today);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const departments = ['All', ...new Set(employees.map((e) => e.department))];

  const filtered = employees.filter((e) => {
    const matchSearch =
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      e.designation?.toLowerCase().includes(search.toLowerCase()) ||
      e.department?.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const pendingLeaves  = myLeaves.filter((l) => l.status === 'pending').length;
  const approvedLeaves = myLeaves.filter((l) => l.status === 'approved').length;
  const presentDays    = myAttend.length;

  if (loading) return <LoadingSpinner text="Loading dashboard…" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Welcome banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -right-4 w-32 h-32 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">
              Good {getGreeting()}, {user.firstName}! 👋
            </h1>
            <p className="text-brand-200 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex-shrink-0">
            {todayRecord ? (
              <div className="text-right">
                <p className="text-xs text-brand-200">Clocked in at</p>
                <p className="text-2xl font-bold">{todayRecord.clockIn}</p>
                {todayRecord.clockOut && <p className="text-xs text-brand-200">Out: {todayRecord.clockOut}</p>}
              </div>
            ) : (
              <Link to="/employee/attendance" className="btn bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur text-sm">
                <Clock size={15} />
                Clock In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat label="Team Size"       value={employees.length}  icon={Users}       bg="bg-brand-50"   iconColor="text-brand-600" sub="Active employees" />
        <QuickStat label="Days Present"    value={presentDays}       icon={Clock}       bg="bg-emerald-50" iconColor="text-emerald-600" sub="This month" />
        <QuickStat label="Pending Leaves"  value={pendingLeaves}     icon={CalendarDays} bg="bg-amber-50"  iconColor="text-amber-600"  sub="Awaiting approval" />
        <QuickStat label="Approved Leaves" value={approvedLeaves}    icon={TrendingUp}  bg="bg-purple-50"  iconColor="text-purple-600" sub="This year" />
      </div>

      {/* ── Recent leave requests ── */}
      {myLeaves.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
            <h2 className="font-semibold text-surface-900 text-sm">Recent Leave Requests</h2>
            <Link to="/employee/leave" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-surface-50">
            {myLeaves.slice(0, 3).map((leave) => (
              <div key={leave.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
                    <CalendarDays size={14} className="text-surface-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">{leave.type}</p>
                    <p className="text-xs text-surface-400">
                      {formatDate(leave.startDate)} → {formatDate(leave.endDate)} · {leave.duration}d
                    </p>
                  </div>
                </div>
                <StatusBadge status={leave.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Employee directory ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-surface-900">Employee Directory</h2>
            <p className="text-xs text-surface-400 mt-0.5">{filtered.length} of {employees.length} employees</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search employees…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-8 py-2 text-sm w-44 sm:w-56"
              />
            </div>
            {/* Dept filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="input py-2 text-sm w-36"
            >
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No employees found" description="Try adjusting your search or filter." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
