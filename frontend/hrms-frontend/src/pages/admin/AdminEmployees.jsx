import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Search, Edit3, Trash2,
  Shield, Mail, Phone,
} from 'lucide-react';
import {
  apiGetAllUsers,
  apiUpdateUserByAdmin,
  apiDeleteUser,
} from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { formatDate, getDepartmentColor, getRoleBadgeClass } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Administration', 'Unassigned'];
const ROLES = ['employee', 'hr', 'admin'];

// ── Edit employee modal ───────────────────────────────────────────────────────
function EditModal({ open, onClose, employee, onSave }) {
  const [form, setForm]     = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        firstName:   employee.firstName,
        lastName:    employee.lastName,
        email:       employee.email,
        phone:       employee.phone || '',
        department:  employee.department || '',
        designation: employee.designation || '',
        role:        employee.role,
      });
    }
  }, [employee]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await apiUpdateUserByAdmin(employee.id, form);
      toast.success('Employee updated successfully');
      onSave(updated);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!employee) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Employee" maxWidth="max-w-lg">
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">First Name</label>
            <input className="input" value={form.firstName || ''} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} />
          </div>
          <div>
            <label className="label">Last Name</label>
            <input className="input" value={form.lastName || ''} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email || ''} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone || ''} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Department</label>
            <select className="input" value={form.department || ''} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role || 'employee'} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Designation</label>
          <input className="input" value={form.designation || ''} onChange={(e) => setForm(f => ({ ...f, designation: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-100">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={saving}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminEmployees() {
  const { user: me } = useAuth();
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('All');
  const [deptFilter,  setDeptFilter]  = useState('All');
  const [editTarget,  setEditTarget]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,    setDeleting]    = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiGetAllUsers();
      setUsers(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.designation?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q);
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchDept = deptFilter === 'All' || u.department === deptFilter;
    return matchSearch && matchRole && matchDept;
  });

  const departments = ['All', ...new Set(users.map((u) => u.department).filter(Boolean))];

  function handleEditSave(updated) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDeleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success(`${deleteTarget.firstName} has been removed`);
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner text="Loading employees…" />;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Employee Management"
        subtitle={`${users.length} total users · ${filtered.length} shown`}
      />

      {/* Filters bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search by name, email, role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input text-sm py-2">
            <option value="All">All Roles</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input text-sm py-2">
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Role pills */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'employee', 'hr', 'admin'].map((r) => {
          const count = r === 'All' ? users.length : users.filter(u => u.role === r).length;
          return (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`badge cursor-pointer transition-all text-xs ${
                roleFilter === r ? 'bg-brand-600 text-white' : 'badge-gray hover:bg-surface-200'
              }`}
            >
              {r === 'All' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="ml-1 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Adjust search or filters." />
      ) : (
        <div className="card overflow-hidden">
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar user={emp} size="md" />
                        <div>
                          <p className="font-semibold text-surface-900 text-sm">
                            {emp.firstName} {emp.lastName}
                            {emp.id === me?.id && <span className="ml-2 badge badge-blue text-xs">You</span>}
                          </p>
                          <p className="text-xs text-surface-400">{emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge text-xs ${getDepartmentColor(emp.department)}`}>
                        {emp.department}
                      </span>
                    </td>
                    <td>
                      <span className={`${getRoleBadgeClass(emp.role)} text-xs`}>
                        <Shield size={10} />
                        {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="space-y-0.5">
                        <p className="text-xs text-surface-600 flex items-center gap-1">
                          <Mail size={10} className="text-surface-400" />{emp.email}
                        </p>
                        {emp.phone && (
                          <p className="text-xs text-surface-400 flex items-center gap-1">
                            <Phone size={10} />{emp.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td><span className="text-xs text-surface-500">{formatDate(emp.createdAt)}</span></td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/employees/${emp.id}`}
                          className="btn-ghost btn-sm text-xs"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setEditTarget(emp)}
                          className="btn-ghost btn-sm"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        {emp.id !== me?.id && (
                          <button
                            onClick={() => setDeleteTarget(emp)}
                            className="btn-ghost btn-sm text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-surface-100 text-xs text-surface-400">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}

      {/* Edit modal */}
      <EditModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        employee={editTarget}
        onSave={handleEditSave}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove Employee"
        message={`Are you sure you want to remove ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This action cannot be undone.`}
        confirmLabel="Remove"
        confirmClass="btn-danger"
      />
    </div>
  );
}
