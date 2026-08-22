import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, ArrowRight, Grid3X3, List } from 'lucide-react';
import { apiGetAllEmployees } from '../../services/api.js';
import Avatar from '../../components/common/Avatar.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { getDepartmentColor } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

function EmployeeCard({ employee }) {
  return (
    <Link
      to={`/employee/employees/${employee.id}`}
      className="card p-5 hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 block group"
    >
      <div className="flex flex-col items-center text-center">
        <Avatar user={employee} size="xl" className="mb-3" />
        <h3 className="font-semibold text-surface-900 text-sm group-hover:text-brand-600 transition-colors">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">{employee.designation}</p>
        <span className={`badge mt-2 text-xs ${getDepartmentColor(employee.department)}`}>
          {employee.department}
        </span>
      </div>
    </Link>
  );
}

function EmployeeRow({ employee }) {
  return (
    <Link
      to={`/employee/employees/${employee.id}`}
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50 transition-colors border-b border-surface-50 last:border-0 group"
    >
      <Avatar user={employee} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
          {employee.firstName} {employee.lastName}
        </p>
        <p className="text-xs text-surface-500">{employee.designation}</p>
      </div>
      <span className={`badge text-xs ${getDepartmentColor(employee.department)}`}>
        {employee.department}
      </span>
      <p className="text-xs text-surface-400 hidden sm:block">{employee.email}</p>
      <ArrowRight size={14} className="text-surface-300 group-hover:text-brand-400 transition-colors flex-shrink-0" />
    </Link>
  );
}

export default function Employees() {
  const [employees,  setEmployees]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [view,       setView]       = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    apiGetAllEmployees()
      .then(setEmployees)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const departments = ['All', ...new Set(employees.map((e) => e.department))];

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      e.designation?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.department?.toLowerCase().includes(q);
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  if (loading) return <LoadingSpinner text="Loading employees…" />;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Employee Directory"
        subtitle={`${employees.length} team members`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search by name, role, department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="input w-44"
          >
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
          {/* View toggle */}
          <div className="flex rounded-lg border border-surface-200 overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2.5 ${view === 'grid' ? 'bg-brand-600 text-white' : 'bg-white text-surface-500 hover:bg-surface-50'}`}
              aria-label="Grid view"
            >
              <Grid3X3 size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2.5 ${view === 'list' ? 'bg-brand-600 text-white' : 'bg-white text-surface-500 hover:bg-surface-50'}`}
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Department chips */}
      <div className="flex gap-2 flex-wrap">
        {departments.map((d) => (
          <button
            key={d}
            onClick={() => setDeptFilter(d)}
            className={`badge text-xs cursor-pointer transition-all ${
              deptFilter === d
                ? 'bg-brand-600 text-white'
                : 'badge-gray hover:bg-surface-200'
            }`}
          >
            {d}
            {d !== 'All' && (
              <span className="ml-1 opacity-70">
                {employees.filter((e) => e.department === d).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No employees found"
          description="Try a different search term or department filter."
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {filtered.map((emp) => (
            <EmployeeRow key={emp.id} employee={emp} />
          ))}
        </div>
      )}
    </div>
  );
}
