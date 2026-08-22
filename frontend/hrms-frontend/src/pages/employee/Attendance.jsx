import { useState, useEffect, useCallback } from 'react';
import {
  Clock, LogIn, LogOut, CalendarDays, Timer,
  CheckCircle2,
} from 'lucide-react';
import {
  apiGetMyAttendance,
  apiClockIn,
  apiClockOut,
  apiGetTodayAttendance,
} from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

// Live clock component
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span>
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

// Clock-in/out panel
function AttendancePanel({ todayRecord, onClockIn, onClockOut, loading }) {
  const isClocked   = !!todayRecord?.clockIn;
  const isClockedOut = !!todayRecord?.clockOut;

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        {/* Left: status + time */}
        <div>
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="text-4xl font-bold text-surface-900 tabular-nums">
            <LiveClock />
          </div>

          {/* Status row */}
          <div className="flex items-center gap-3 mt-3">
            {!isClocked && (
              <span className="flex items-center gap-1.5 text-sm text-surface-500">
                <span className="w-2 h-2 rounded-full bg-surface-300" />
                Not clocked in
              </span>
            )}
            {isClocked && !isClockedOut && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Clocked in · {todayRecord.clockIn}
              </span>
            )}
            {isClockedOut && (
              <span className="flex items-center gap-1.5 text-sm text-surface-600 font-medium">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Completed · {todayRecord.workingDuration}
              </span>
            )}
          </div>
        </div>

        {/* Right: clock in/out buttons */}
        <div className="flex flex-col gap-3 sm:items-end w-full sm:w-auto">
          {/* Today summary pills */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center px-4 py-2 bg-surface-50 rounded-xl border border-surface-200">
              <p className="text-xs text-surface-400">In</p>
              <p className="text-sm font-bold text-surface-800">{todayRecord?.clockIn || '—'}</p>
            </div>
            <div className="flex flex-col items-center px-4 py-2 bg-surface-50 rounded-xl border border-surface-200">
              <p className="text-xs text-surface-400">Out</p>
              <p className="text-sm font-bold text-surface-800">{todayRecord?.clockOut || '—'}</p>
            </div>
            <div className="flex flex-col items-center px-4 py-2 bg-surface-50 rounded-xl border border-surface-200">
              <p className="text-xs text-surface-400">Hours</p>
              <p className="text-sm font-bold text-surface-800">{todayRecord?.workingDuration || '—'}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {!isClocked && (
              <button
                onClick={onClockIn}
                disabled={loading}
                className="btn-success btn-lg gap-2"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={18} />}
                Clock In
              </button>
            )}
            {isClocked && !isClockedOut && (
              <button
                onClick={onClockOut}
                disabled={loading}
                className="btn-danger btn-lg gap-2"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogOut size={18} />}
                Clock Out
              </button>
            )}
            {isClockedOut && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
                <CheckCircle2 size={16} />
                Day completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Attendance() {
  const [records,     setRecords]     = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [recs, today] = await Promise.all([
        apiGetMyAttendance(),
        apiGetTodayAttendance(),
      ]);
      setRecords(recs);
      setTodayRecord(today);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleClockIn() {
    setActionLoading(true);
    try {
      await apiClockIn();
      toast.success('Clocked in successfully!');
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClockOut() {
    setActionLoading(true);
    try {
      await apiClockOut();
      toast.success('Clocked out. Have a great evening!');
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <LoadingSpinner text="Loading attendance…" />;

  const presentCount = records.filter((r) => r.status === 'present').length;
  const totalHours   = records.reduce((sum, r) => {
    if (!r.workingDuration) return sum;
    const match = r.workingDuration.match(/(\d+)h\s*(\d+)m/);
    if (!match) return sum;
    return sum + parseInt(match[1]) + parseInt(match[2]) / 60;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Attendance"
        subtitle="Track your clock-in and clock-out records"
      />

      {/* Clock panel */}
      <AttendancePanel
        todayRecord={todayRecord}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
        loading={actionLoading}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-brand-600">{presentCount}</p>
          <p className="text-xs text-surface-500 mt-0.5 font-medium">Days Present</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-surface-900">{totalHours.toFixed(1)}h</p>
          <p className="text-xs text-surface-500 mt-0.5 font-medium">Total Hours</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {presentCount > 0 ? (totalHours / presentCount).toFixed(1) : '0'}h
          </p>
          <p className="text-xs text-surface-500 mt-0.5 font-medium">Avg / Day</p>
        </div>
      </div>

      {/* History table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-2">
          <CalendarDays size={16} className="text-surface-400" />
          <h2 className="font-semibold text-surface-900 text-sm">Attendance History</h2>
          <span className="badge-gray ml-auto">{records.length} records</span>
        </div>

        {records.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No attendance records"
            description="Your attendance history will appear here once you start clocking in."
          />
        ) : (
          <div className="table-container rounded-none border-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => {
                  const isToday = rec.date === new Date().toISOString().split('T')[0];
                  return (
                    <tr key={rec.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-surface-800">{formatDate(rec.date)}</span>
                          {isToday && <span className="badge badge-blue text-xs">Today</span>}
                        </div>
                      </td>
                      <td>
                        <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                          <LogIn size={13} />
                          {rec.clockIn}
                        </span>
                      </td>
                      <td>
                        {rec.clockOut ? (
                          <span className="flex items-center gap-1.5 text-red-500 font-medium">
                            <LogOut size={13} />
                            {rec.clockOut}
                          </span>
                        ) : (
                          <span className="text-surface-400 text-xs italic">—</span>
                        )}
                      </td>
                      <td>
                        {rec.workingDuration ? (
                          <span className="flex items-center gap-1.5 font-medium text-surface-700">
                            <Timer size={13} className="text-surface-400" />
                            {rec.workingDuration}
                          </span>
                        ) : (
                          <span className="text-surface-400 text-xs italic">In progress</span>
                        )}
                      </td>
                      <td><StatusBadge status={rec.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
