import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, Edit3, Save, Search,
  TrendingUp, TrendingDown, Shield, AlertTriangle,
} from 'lucide-react';
import { apiGetAllSalaries, apiUpdateSalary, apiGetAllUsers } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Modal from '../../components/common/Modal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { getDepartmentColor } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

// ── Authorization guard ────────────────────────────────────────────────────────
function SalaryGuard({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Shield size={28} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-surface-900 mb-2">Access Denied</h2>
        <p className="text-surface-500 text-sm max-w-xs">
          Salary information is confidential and only accessible to authorised HR and Admin users.
        </p>
      </div>
    );
  }
  return children;
}

// ── Standalone number input (extracted from modal to avoid static-component warning) ──
function NumberInput({ label, help, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      {help && <p className="text-xs text-surface-400 mb-1">{help}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 font-medium text-sm">$</span>
        <input
          type="number"
          min="0"
          step="100"
          value={value}
          onChange={onChange}
          className="input pl-7"
          placeholder="0"
        />
      </div>
    </div>
  );
}

// ── Edit salary modal ─────────────────────────────────────────────────────────
function EditSalaryModal({ open, onClose, employee, salary, onSave }) {
  const [form, setForm]     = useState({ baseSalary: 0, bonus: 0, deductions: 0, payPeriod: 'Monthly' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (salary) {
      setForm({
        baseSalary: salary.baseSalary,
        bonus:      salary.bonus,
        deductions: salary.deductions,
        payPeriod:  salary.payPeriod || 'Monthly',
      });
    } else {
      setForm({ baseSalary: 0, bonus: 0, deductions: 0, payPeriod: 'Monthly' });
    }
  }, [salary, open]);

  const net = (Number(form.baseSalary) || 0) + (Number(form.bonus) || 0) - (Number(form.deductions) || 0);

  async function handleSave(e) {
    e.preventDefault();
    if (!form.baseSalary || Number(form.baseSalary) < 0) { toast.error('Valid base salary is required'); return; }
    setSaving(true);
    try {
      const updated = await apiUpdateSalary(employee.id, {
        baseSalary: Number(form.baseSalary),
        bonus:      Number(form.bonus),
        deductions: Number(form.deductions),
        payPeriod:  form.payPeriod,
      });
      toast.success('Salary updated successfully');
      onSave(updated);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Salary Record" maxWidth="max-w-md">
      {employee && (
        <div className="flex items-center gap-3 mb-5 p-3 bg-surface-50 rounded-xl">
          <Avatar user={employee} size="md" />
          <div>
            <p className="font-semibold text-surface-900">{employee.firstName} {employee.lastName}</p>
            <p className="text-xs text-surface-400">{employee.designation} · {employee.department}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <NumberInput
          label="Base Salary (Annual)"
          help="Annual gross salary before bonuses/deductions"
          value={form.baseSalary}
          onChange={(e) => setForm(f => ({ ...f, baseSalary: e.target.value }))}
        />
        <NumberInput
          label="Bonus"
          value={form.bonus}
          onChange={(e) => setForm(f => ({ ...f, bonus: e.target.value }))}
        />
        <NumberInput
          label="Deductions"
          help="Tax, insurance, etc."
          value={form.deductions}
          onChange={(e) => setForm(f => ({ ...f, deductions: e.target.value }))}
        />

        <div>
          <label className="label">Pay Period</label>
          <select className="input" value={form.payPeriod} onChange={(e) => setForm(f => ({ ...f, payPeriod: e.target.value }))}>
            {['Monthly', 'Bi-Weekly', 'Weekly', 'Annual'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* Net calculation preview */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-surface-600">Base Salary</span>
            <span className="font-medium">${Number(form.baseSalary || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-emerald-600">+ Bonus</span>
            <span className="font-medium text-emerald-600">+${Number(form.bonus || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-red-500">- Deductions</span>
            <span className="font-medium text-red-500">-${Number(form.deductions || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-emerald-200 pt-2">
            <span className="font-bold text-surface-900">Net Salary</span>
            <span className="font-bold text-emerald-700 text-lg">${net.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-surface-100">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={saving}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              : <><Save size={15} /> Save Salary</>
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminSalary() {
  const [salaries,   setSalaries]   = useState([]);
  const [employees,  setEmployees]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    try {
      const [sals, emps] = await Promise.all([
        apiGetAllSalaries(),
        apiGetAllUsers(),
      ]);
      setSalaries(sals);
      setEmployees(emps);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleSave(updated) {
    setSalaries((prev) => {
      const idx = prev.findIndex(s => s.employeeId === updated.employeeId);
      if (idx === -1) return [...prev, updated];
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
  }

  const enriched = salaries.map(s => {
    const emp = employees.find(e => e.id === s.employeeId);
    return { ...s, employee: emp };
  }).filter(s => s.employee);

  const departments = ['All', ...new Set(enriched.map(s => s.employee?.department).filter(Boolean))];

  const filtered = enriched.filter(s => {
    const q    = search.toLowerCase();
    const name = `${s.employee?.firstName} ${s.employee?.lastName}`.toLowerCase();
    const matchSearch = name.includes(q) || s.employee?.designation?.toLowerCase().includes(q);
    const matchDept   = deptFilter === 'All' || s.employee?.department === deptFilter;
    return matchSearch && matchDept;
  });

  const totalPayroll = filtered.reduce((sum, s) => sum + (s.netSalary || 0), 0);
  const avgSalary    = filtered.length > 0 ? Math.round(totalPayroll / filtered.length) : 0;
  const highestSal   = filtered.length > 0 ? Math.max(...filtered.map(s => s.netSalary || 0)) : 0;

  if (loading) return <LoadingSpinner text="Loading payroll data…" />;

  return (
    <SalaryGuard>
      <div className="space-y-5 animate-fade-in">
        <PageHeader
          title="Payroll Management"
          subtitle="Confidential — HR & Admin access only"
        />

        {/* Confidentiality notice */}
        <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            <strong>Confidential:</strong> Salary information is sensitive. Do not share or display to employees.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Payroll',  value: `$${totalPayroll.toLocaleString()}`, icon: DollarSign, bg: 'bg-brand-50',   color: 'text-brand-600' },
            { label: 'Average Salary', value: `$${avgSalary.toLocaleString()}`,    icon: TrendingUp, bg: 'bg-emerald-50', color: 'text-emerald-600' },
            { label: 'Highest Salary', value: `$${highestSal.toLocaleString()}`,   icon: TrendingUp, bg: 'bg-purple-50',  color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={22} className={s.color} />
              </div>
              <div>
                <p className="text-xs text-surface-500 font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-surface-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search employee…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 w-full"
            />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input text-sm py-2 w-44">
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState icon={DollarSign} title="No salary records" description="Add salary records for employees." />
        ) : (
          <div className="card overflow-hidden">
            <div className="table-container border-0 rounded-none">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Base Salary</th>
                    <th>Bonus</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Pay Period</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar user={s.employee} size="sm" />
                          <div>
                            <p className="font-semibold text-surface-800 text-sm">
                              {s.employee?.firstName} {s.employee?.lastName}
                            </p>
                            <p className="text-xs text-surface-400">{s.employee?.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge text-xs ${getDepartmentColor(s.employee?.department)}`}>
                          {s.employee?.department}
                        </span>
                      </td>
                      <td><span className="font-medium text-surface-800">${s.baseSalary?.toLocaleString()}</span></td>
                      <td>
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <TrendingUp size={12} />+${s.bonus?.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className="text-red-500 font-medium flex items-center gap-1">
                          <TrendingDown size={12} />-${s.deductions?.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-surface-900">${s.netSalary?.toLocaleString()}</span>
                      </td>
                      <td><span className="badge badge-gray text-xs">{s.payPeriod}</span></td>
                      <td>
                        <button
                          onClick={() => setEditTarget({ employee: s.employee, salary: s })}
                          className="btn-ghost btn-sm gap-1 text-xs"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface-50">
                    <td colSpan={5} className="text-right font-bold text-surface-700 py-3 px-4 text-sm">Total Payroll</td>
                    <td className="font-bold text-brand-700 py-3 px-4 text-sm">${totalPayroll.toLocaleString()}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <EditSalaryModal
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          employee={editTarget?.employee}
          salary={editTarget?.salary}
          onSave={handleSave}
        />
      </div>
    </SalaryGuard>
  );
}
