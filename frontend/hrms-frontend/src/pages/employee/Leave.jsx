import { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays, Plus, ChevronLeft, ChevronRight,
  Paperclip, Clock,
} from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday,
  parseISO, isWithinInterval,
} from 'date-fns';
import { apiGetMyLeaves, apiCreateLeave } from '../../services/api.js';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const LEAVE_TYPES = ['Paid Time Off', 'Sick Leave', 'Unpaid Leave'];

const TYPE_COLORS = {
  'Paid Time Off': 'bg-brand-100 text-brand-700 border-brand-200',
  'Sick Leave':    'bg-red-100 text-red-600 border-red-200',
  'Unpaid Leave':  'bg-amber-100 text-amber-700 border-amber-200',
};

const STATUS_DOT = {
  approved: 'bg-emerald-500',
  pending:  'bg-amber-400',
  rejected: 'bg-red-400',
};

// ── Request form modal ────────────────────────────────────────────────────────
function LeaveRequestModal({ open, onClose, onSubmit, loading }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    type: LEAVE_TYPES[0],
    startDate: today,
    endDate:   today,
    reason:    '',
  });
  const [errors, setErrors] = useState({});
  const [fileLabel, setFileLabel] = useState('');

  function validate() {
    const e = {};
    if (!form.type)         e.type      = 'Leave type is required';
    if (!form.startDate)    e.startDate = 'Start date is required';
    if (!form.endDate)      e.endDate   = 'End date is required';
    if (form.endDate < form.startDate) e.endDate = 'End date must be after start date';
    if (!form.reason.trim()) e.reason   = 'Reason is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) setFileLabel(file.name);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  // Calculate duration
  const duration = form.startDate && form.endDate && form.endDate >= form.startDate
    ? Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1
    : 0;

  return (
    <Modal open={open} onClose={onClose} title="Request Time Off" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Leave type */}
        <div>
          <label className="label">Leave Type</label>
          <div className="grid grid-cols-3 gap-2">
            {LEAVE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  form.type === t
                    ? TYPE_COLORS[t]
                    : 'border-surface-200 text-surface-600 hover:border-surface-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              min={today}
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className={`input ${errors.startDate ? 'input-error' : ''}`}
            />
            {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
          </div>
          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              min={form.startDate || today}
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              className={`input ${errors.endDate ? 'input-error' : ''}`}
            />
            {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
          </div>
        </div>

        {/* Duration pill */}
        {duration > 0 && (
          <div className="flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-lg px-3.5 py-2.5">
            <Clock size={14} className="text-brand-500" />
            <span className="text-sm text-brand-700 font-medium">
              {duration} day{duration !== 1 ? 's' : ''} of {form.type}
            </span>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="label">Reason</label>
          <textarea
            rows={3}
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder="Brief description of your leave reason…"
            className={`input resize-none ${errors.reason ? 'input-error' : ''}`}
          />
          {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
        </div>

        {/* Attachment (optional) */}
        <div>
          <label className="label">Attachment <span className="text-surface-400 font-normal">(optional)</span></label>
          <label className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-lg border border-dashed border-surface-300 hover:border-brand-400 cursor-pointer transition-colors text-sm text-surface-500 hover:text-brand-600">
            <Paperclip size={14} />
            {fileLabel || 'Upload supporting document…'}
            <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-100">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
            ) : (
              <><Plus size={16} /> Submit Request</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function LeaveCalendar({ leaves, onDayClick }) {
  const [current, setCurrent] = useState(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd   = endOfMonth(current);
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd     = endOfWeek(monthEnd,   { weekStartsOn: 1 });
  const days       = eachDayOfInterval({ start: calStart, end: calEnd });

  function getLeaveStatus(day) {
    for (const leave of leaves) {
      try {
        const start = parseISO(leave.startDate);
        const end   = parseISO(leave.endDate);
        if (isWithinInterval(day, { start, end })) return leave.status;
      } catch { /* skip */ }
    }
    return null;
  }

  return (
    <div className="card p-5">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-surface-900">
          {format(current, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1))}
            className="btn-icon text-surface-500 hover:text-surface-700"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrent(new Date())}
            className="btn-secondary btn-sm text-xs"
          >
            Today
          </button>
          <button
            onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1))}
            className="btn-icon text-surface-500 hover:text-surface-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-surface-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const inMonth   = isSameMonth(day, current);
          const today_    = isToday(day);
          const leaveStatus = getLeaveStatus(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick?.(day)}
              className={`
                relative flex flex-col items-center justify-center h-10 w-full rounded-lg text-xs font-medium transition-all
                ${!inMonth ? 'text-surface-300' : 'text-surface-700 hover:bg-surface-100'}
                ${today_ ? 'bg-brand-600 text-white hover:bg-brand-700 font-bold' : ''}
                ${leaveStatus && inMonth && !today_ ? 'ring-1 ring-inset ring-current/30' : ''}
              `}
              style={leaveStatus && inMonth && !today_ ? { backgroundColor: leaveColors[leaveStatus] } : {}}
            >
              {format(day, 'd')}
              {leaveStatus && inMonth && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${STATUS_DOT[leaveStatus]}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-3 border-t border-surface-100">
        {[['approved','Approved','bg-emerald-500'],['pending','Pending','bg-amber-400'],['rejected','Rejected','bg-red-400']].map(([s,l,c]) => (
          <div key={s} className="flex items-center gap-1.5 text-xs text-surface-500">
            <span className={`w-2 h-2 rounded-full ${c}`} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

const leaveColors = {
  approved: 'rgb(209 250 229 / 0.8)',
  pending:  'rgb(254 243 199 / 0.8)',
  rejected: 'rgb(254 226 226 / 0.6)',
};

// ── Leave request row ─────────────────────────────────────────────────────────
function LeaveRow({ leave }) {
  const typeColor = TYPE_COLORS[leave.type] || 'border-surface-200 text-surface-600';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center flex-shrink-0">
          <CalendarDays size={16} className="text-surface-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge border ${typeColor} text-xs`}>{leave.type}</span>
            <span className="text-xs text-surface-400">
              {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
            </span>
            <span className="text-xs text-surface-400">· {leave.duration}d</span>
          </div>
          <p className="text-sm text-surface-600 mt-1 truncate">{leave.reason}</p>
          <p className="text-xs text-surface-400 mt-0.5">Applied {formatDate(leave.createdAt)}</p>
        </div>
      </div>
      <StatusBadge status={leave.status} />
    </div>
  );
}

export default function Leave() {
  const [leaves,      setLeaves]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [activeTab,   setActiveTab]   = useState('all');

  const load = useCallback(async () => {
    try {
      const data = await apiGetMyLeaves();
      setLeaves(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(form) {
    setSubmitting(true);
    try {
      await apiCreateLeave(form);
      toast.success('Leave request submitted — pending review.');
      setModalOpen(false);
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = activeTab === 'all'
    ? leaves
    : leaves.filter((l) => l.status === activeTab);

  const counts = {
    all:      leaves.length,
    pending:  leaves.filter((l) => l.status === 'pending').length,
    approved: leaves.filter((l) => l.status === 'approved').length,
    rejected: leaves.filter((l) => l.status === 'rejected').length,
  };

  if (loading) return <LoadingSpinner text="Loading leave records…" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Time Off"
        subtitle="Manage your leave requests and view your leave history"
        actions={
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Request Time Off
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <LeaveCalendar leaves={leaves} />

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              ['Pending', counts.pending, 'text-amber-600 bg-amber-50'],
              ['Approved', counts.approved, 'text-emerald-600 bg-emerald-50'],
              ['Rejected', counts.rejected, 'text-red-600 bg-red-50'],
            ].map(([label, val, cls]) => (
              <div key={label} className={`rounded-xl ${cls} p-3 text-center`}>
                <p className="text-lg font-bold">{val}</p>
                <p className="text-xs opacity-70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leave list */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-surface-100 overflow-x-auto">
              {[
                { id: 'all',      label: 'All' },
                { id: 'pending',  label: 'Pending' },
                { id: 'approved', label: 'Approved' },
                { id: 'rejected', label: 'Rejected' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-surface-500 hover:text-surface-700'
                  }`}
                >
                  {tab.label}
                  {counts[tab.id] > 0 && (
                    <span className={`badge ${activeTab === tab.id ? 'badge-blue' : 'badge-gray'} text-xs`}>
                      {counts[tab.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title={`No ${activeTab === 'all' ? '' : activeTab} leave requests`}
                description={activeTab === 'all' ? 'Submit a request using the button above.' : ''}
                action={
                  activeTab === 'all' && (
                    <button onClick={() => setModalOpen(true)} className="btn-primary btn-sm">
                      <Plus size={14} /> Request Time Off
                    </button>
                  )
                }
              />
            ) : (
              <div>
                {filtered.map((leave) => (
                  <LeaveRow key={leave.id} leave={leave} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request modal */}
      <LeaveRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
}
