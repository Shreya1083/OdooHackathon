import { useState, useEffect, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import {
  Clock, Search,
  LogIn, LogOut, Timer, CalendarDays,
} from 'lucide-react';
import { apiGetAllAttendance } from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const today     = format(new Date(), 'yyyy-MM-dd');
const weekAgo   = format(subDays(new Date(), 7), 'yyyy-MM-dd');
const monthAgo  = format(subDays(new Date(), 30), 'yyyy-MM-dd');

// Summary bar
function SummaryBar({ records, dateFrom, dateTo }) {
  const inRange = records.filter((r) => r.date >= dateFrom && r.date <= dateTo);
  const presentCount = inRange.length;
  const clockedOut   = inRange.filter((r) => r.clockOut).length;
  const totalHours   = inRange.reduce((sum, r) => {
    if (!r.workingDuration) return sum;
    const m = r.workingDuration.match(/(\d+)h\s*(\d+)m/);
    return m ? sum + parseInt(m[1]) + parseInt(m[2]) / 60 : sum;
  }, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Total Records',  value: inRange.length,          color: 'text-brand-600',   bg: 'bg-brand-50' },
        { label: 'Clocked In',     value: presentCount,            color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Clocked Out',    value: clockedOut,              color: 'text-surface-700', bg: 'bg-surface-100' },
        { label: 'Total Hours',    value: `${totalHours.toFixed(1)}h`, color: 'text-purple-600', bg: 'bg-purple-50' },
      ].map((s) => (
        <div key={s.label} className={`card p-4 flex flex-col items-center text-center ${s.bg}`}>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-surface-500 mt-0.5 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminAttendance() {
  const [records,    setRecords]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [dateFrom,   setDateFrom]   = useState(weekAgo);
  const [dateTo,     setDateTo]     = useState(today);
  const [deptFilter, setDeptFilter] = useState('All');

  const load = useCallback(async () => {
    try {
      const data = await apiGetAllAttendance();
      setRecords(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const departments = ['All', ...new Set(records.map((r) => r.department).filter(Boolean))];

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.employeeName?.toLowerCase().includes(q) || r.department?.toLowerCase().includes(q);
    const matchDate   = r.date >= dateFrom && r.date <= dateTo;
    const matchDept   = deptFilter === 'All' || r.department === deptFilter;
    return matchSearch && matchDate && matchDept;
  });

  // Group by date for display
  const grouped = filtered.reduce((acc, r) => {
    const key = r.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

  if (loading) return <LoadingSpinner text="Loading attendance…" />;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Attendance Management"
        subtitle="Monitor employee attendance across the organisation"
      />

      {/* Summary */}
      <SummaryBar records={records} dateFrom={dateFrom} dateTo={dateTo} />

      {/* Filters */}
      <div className="card p-4 flex flex-col lg:flex-row gap-3 items-start lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search employee or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        {/* Date range */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-surface-500 font-medium whitespace-nowrap">From</label>
            <input type="date" max={dateTo} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input text-sm py-2 w-36" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-surface-500 font-medium">To</label>
            <input type="date" min={dateFrom} max={today} value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input text-sm py-2 w-36" />
          </div>
          {/* Quick date buttons */}
          <div className="flex gap-1">
            {[
              { label: 'Today',  from: today,    to: today },
              { label: '7d',     from: weekAgo,  to: today },
              { label: '30d',    from: monthAgo, to: today },
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => { setDateFrom(q.from); setDateTo(q.to); }}
                className={`btn-sm rounded-lg text-xs ${
                  dateFrom === q.from && dateTo === q.to ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input text-sm py-2 w-44">
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState icon={Clock} title="No records found" description="Try adjusting filters or date range." />
      ) : (
        <div className="space-y-4">
          {sortedDates.map((date) => {
            const isToday_ = date === today;
            return (
              <div key={date} className="card overflow-hidden">
                {/* Date header */}
                <div className="flex items-center gap-2 px-5 py-3 bg-surface-50 border-b border-surface-100">
                  <CalendarDays size={15} className="text-surface-400" />
                  <span className="text-sm font-semibold text-surface-800">{formatDate(date)}</span>
                  {isToday_ && <span className="badge badge-blue text-xs">Today</span>}
                  <span className="badge badge-gray text-xs ml-auto">{grouped[date].length} records</span>
                </div>
                <div className="table-container border-0 rounded-none">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[date].map((rec) => (
                        <tr key={rec.id}>
                          <td>
                            <p className="font-semibold text-surface-800 text-sm">{rec.employeeName}</p>
                          </td>
                          <td>
                            <span className="text-xs text-surface-500">{rec.department}</span>
                          </td>
                          <td>
                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
                              <LogIn size={12} />{rec.clockIn}
                            </span>
                          </td>
                          <td>
                            {rec.clockOut ? (
                              <span className="flex items-center gap-1.5 text-red-500 font-medium text-sm">
                                <LogOut size={12} />{rec.clockOut}
                              </span>
                            ) : (
                              <span className="badge badge-blue text-xs">Active</span>
                            )}
                          </td>
                          <td>
                            {rec.workingDuration ? (
                              <span className="flex items-center gap-1 text-sm text-surface-700 font-medium">
                                <Timer size={12} className="text-surface-400" />{rec.workingDuration}
                              </span>
                            ) : <span className="text-xs text-surface-400 italic">—</span>}
                          </td>
                          <td><StatusBadge status={rec.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs text-surface-400 text-center py-2">
        Showing {filtered.length} records from {formatDate(dateFrom)} to {formatDate(dateTo)}
      </div>
    </div>
  );
}
