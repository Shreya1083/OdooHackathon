import { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays, Search, CheckCircle, XCircle,
  Clock, Eye,
} from 'lucide-react';
import { apiGetAllLeaves, apiReviewLeave } from '../../services/api.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Modal from '../../components/common/Modal.jsx';
import { formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const LEAVE_TYPE_COLORS = {
  'Paid Time Off': 'bg-brand-100 text-brand-700',
  'Sick Leave':    'bg-red-100 text-red-600',
  'Unpaid Leave':  'bg-amber-100 text-amber-700',
};

// ── Leave detail modal ────────────────────────────────────────────────────────
function LeaveDetailModal({ open, onClose, leave, onApprove, onReject, loading }) {
  if (!leave) return null;
  return (
    <Modal open={open} onClose={onClose} title="Leave Request Details" maxWidth="max-w-md">
      <div className="space-y-4">
        {/* Employee */}
        <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center font-bold text-brand-700">
            {leave.employeeName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-surface-900">{leave.employeeName}</p>
            <p className="text-xs text-surface-400">{leave.department}</p>
          </div>
          <StatusBadge status={leave.status} />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-surface-50 rounded-lg">
            <p className="text-xs text-surface-400 font-medium">Leave Type</p>
            <p className="font-semibold mt-0.5">
              <span className={`badge text-xs ${LEAVE_TYPE_COLORS[leave.type] || 'badge-gray'}`}>{leave.type}</span>
            </p>
          </div>
          <div className="p-3 bg-surface-50 rounded-lg">
            <p className="text-xs text-surface-400 font-medium">Duration</p>
            <p className="font-semibold text-surface-800 mt-0.5">{leave.duration} day{leave.duration !== 1 ? 's' : ''}</p>
          </div>
          <div className="p-3 bg-surface-50 rounded-lg">
            <p className="text-xs text-surface-400 font-medium">Start Date</p>
            <p className="font-semibold text-surface-800 mt-0.5">{formatDate(leave.startDate)}</p>
          </div>
          <div className="p-3 bg-surface-50 rounded-lg">
            <p className="text-xs text-surface-400 font-medium">End Date</p>
            <p className="font-semibold text-surface-800 mt-0.5">{formatDate(leave.endDate)}</p>
          </div>
        </div>

        {/* Reason */}
        <div>
          <p className="text-xs text-surface-400 font-medium mb-1">Reason</p>
          <p className="text-sm text-surface-700 bg-surface-50 rounded-lg p-3 leading-relaxed">{leave.reason}</p>
        </div>

        <p className="text-xs text-surface-400">Submitted: {formatDate(leave.createdAt)}</p>

        {/* Actions */}
        {leave.status === 'pending' && (
          <div className="flex gap-3 pt-2 border-t border-surface-100">
            <button
              onClick={() => onReject(leave.id)}
              disabled={loading}
              className="btn-danger flex-1"
            >
              {loading === 'rejected' ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <XCircle size={15} />}
              Reject
            </button>
            <button
              onClick={() => onApprove(leave.id)}
              disabled={loading}
              className="btn-success flex-1"
            >
              {loading === 'approved' ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={15} />}
              Approve
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ── Leave row ─────────────────────────────────────────────────────────────────
function LeaveRow({ leave, onApprove, onReject, onView, loading }) {
  const isPending = leave.status === 'pending';
  return (
    <tr>
      <td>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
            {leave.employeeName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-surface-800 text-sm">{leave.employeeName}</p>
            <p className="text-xs text-surface-400">{leave.department}</p>
          </div>
        </div>
      </td>
      <td>
        <span className={`badge text-xs ${LEAVE_TYPE_COLORS[leave.type] || 'badge-gray'}`}>
          {leave.type}
        </span>
      </td>
      <td><span className="text-sm text-surface-700">{formatDate(leave.startDate)}</span></td>
      <td><span className="text-sm text-surface-700">{formatDate(leave.endDate)}</span></td>
      <td>
        <span className="font-semibold text-surface-800 text-sm">{leave.duration}d</span>
      </td>
      <td><StatusBadge status={leave.status} /></td>
      <td>
        <div className="flex items-center gap-1">
          <button onClick={() => onView(leave)} className="btn-ghost btn-sm text-xs" title="View details">
            <Eye size={13} />
          </button>
          {isPending && (
            <>
              <button
                onClick={() => onApprove(leave.id)}
                disabled={!!loading}
                className="btn-success btn-sm text-xs gap-1"
                title="Approve"
              >
                {loading === leave.id + '_approved'
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <CheckCircle size={13} />
                }
                Approve
              </button>
              <button
                onClick={() => onReject(leave.id)}
                disabled={!!loading}
                className="btn-danger btn-sm text-xs gap-1"
                title="Reject"
              >
                {loading === leave.id + '_rejected'
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <XCircle size={13} />
                }
                Reject
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AdminLeave() {
  const [leaves,      setLeaves]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [actionLoad,  setActionLoad]  = useState(null); // leaveId_action
  const [activeTab,   setActiveTab]   = useState('pending');
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState('All');
  const [viewTarget,  setViewTarget]  = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { id, action }
  const [confirmLoading, setConfirmLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiGetAllLeaves();
      setLeaves(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function doReview(leaveId, action) {
    const key = `${leaveId}_${action}`;
    setActionLoad(key);
    try {
      const updated = await apiReviewLeave(leaveId, action);
      setLeaves((prev) =>
        prev.map((l) => l.id === leaveId ? { ...l, ...updated } : l)
      );
      toast.success(action === 'approved' ? 'Leave request approved ✓' : 'Leave request rejected');
      setViewTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActionLoad(null);
    }
  }

  async function handleConfirm() {
    if (!confirmAction) return;
    setConfirmLoading(true);
    await doReview(confirmAction.id, confirmAction.action);
    setConfirmLoading(false);
    setConfirmAction(null);
  }

  const tabs = [
    { id: 'pending',  label: 'Pending',  icon: Clock },
    { id: 'approved', label: 'Approved', icon: CheckCircle },
    { id: 'rejected', label: 'Rejected', icon: XCircle },
    { id: 'all',      label: 'All',      icon: CalendarDays },
  ];

  const counts = {
    pending:  leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
    all:      leaves.length,
  };

  const leaveTypes = ['All', ...new Set(leaves.map(l => l.type))];

  const filtered = leaves.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = l.employeeName?.toLowerCase().includes(q) || l.department?.toLowerCase().includes(q);
    const matchTab    = activeTab === 'all' || l.status === activeTab;
    const matchType   = typeFilter === 'All' || l.type === typeFilter;
    return matchSearch && matchTab && matchType;
  });

  if (loading) return <LoadingSpinner text="Loading leave requests…" />;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Leave Management"
        subtitle="Review and process employee leave requests"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending',  value: counts.pending,  bg: 'bg-amber-50',   text: 'text-amber-600',  border: 'border-amber-200' },
          { label: 'Approved', value: counts.approved, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
          { label: 'Rejected', value: counts.rejected, bg: 'bg-red-50',     text: 'text-red-500',    border: 'border-red-200' },
          { label: 'Total',    value: counts.all,      bg: 'bg-brand-50',   text: 'text-brand-600',  border: 'border-brand-200' },
        ].map((s) => (
          <div key={s.label} className={`card p-4 text-center border ${s.border} ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search by employee or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input text-sm py-2 w-44">
          {leaveTypes.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Tab bar */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-surface-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {counts[tab.id] > 0 && (
                  <span className={`badge text-xs ${activeTab === tab.id ? 'badge-blue' : 'badge-gray'}`}>
                    {counts[tab.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={`No ${activeTab === 'all' ? '' : activeTab} leave requests`}
            description="Nothing to show here."
          />
        ) : (
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((leave) => (
                  <LeaveRow
                    key={leave.id}
                    leave={leave}
                    onApprove={(id) => setConfirmAction({ id, action: 'approved' })}
                    onReject={(id)  => setConfirmAction({ id, action: 'rejected' })}
                    onView={(l)     => setViewTarget(l)}
                    loading={actionLoad}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          Showing {filtered.length} of {counts[activeTab === 'all' ? 'all' : activeTab]} requests
        </div>
      </div>

      {/* Detail modal */}
      <LeaveDetailModal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        leave={viewTarget}
        onApprove={(id) => setConfirmAction({ id, action: 'approved' })}
        onReject={(id)  => setConfirmAction({ id, action: 'rejected' })}
        loading={actionLoad ? actionLoad.split('_')[1] : null}
      />

      {/* Confirm dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        loading={confirmLoading}
        title={confirmAction?.action === 'approved' ? 'Approve Leave Request?' : 'Reject Leave Request?'}
        message={
          confirmAction?.action === 'approved'
            ? 'This will approve the leave request and notify the employee.'
            : 'This will reject the leave request. This action cannot be undone.'
        }
        confirmLabel={confirmAction?.action === 'approved' ? 'Approve' : 'Reject'}
        confirmClass={confirmAction?.action === 'approved' ? 'btn-success' : 'btn-danger'}
      />
    </div>
  );
}
