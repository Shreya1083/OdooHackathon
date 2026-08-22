// ─── Mock Data Store ────────────────────────────────────────────────────────
// This simulates a backend. All data lives here and is mutated via the
// service layer — no real API calls are made in this frontend-only demo.

import { addDays, subDays, format } from 'date-fns';

const today = new Date();
const fmt = (d) => format(d, 'yyyy-MM-dd');

// ── Users ────────────────────────────────────────────────────────────────────
export const users = [
  {
    id: 'u1',
    firstName: 'Alice',
    lastName: 'Johnson',
    username: 'alice.johnson',
    email: 'alice@hrms.com',
    phone: '+1 555-0101',
    passwordHash: 'pass123',   // plain text for demo only
    role: 'employee',
    department: 'Engineering',
    designation: 'Frontend Developer',
    avatar: null,
    salary: null,              // employees never see this
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'u2',
    firstName: 'Bob',
    lastName: 'Martinez',
    username: 'bob.martinez',
    email: 'bob@hrms.com',
    phone: '+1 555-0102',
    passwordHash: 'pass123',
    role: 'employee',
    department: 'Engineering',
    designation: 'Backend Developer',
    avatar: null,
    salary: null,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: 'u3',
    firstName: 'Carol',
    lastName: 'Smith',
    username: 'carol.smith',
    email: 'carol@hrms.com',
    phone: '+1 555-0103',
    passwordHash: 'pass123',
    role: 'employee',
    department: 'Design',
    designation: 'UI/UX Designer',
    avatar: null,
    salary: null,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05',
  },
  {
    id: 'u4',
    firstName: 'David',
    lastName: 'Lee',
    username: 'david.lee',
    email: 'david@hrms.com',
    phone: '+1 555-0104',
    passwordHash: 'pass123',
    role: 'employee',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    avatar: null,
    salary: null,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
  {
    id: 'u5',
    firstName: 'Emily',
    lastName: 'Chen',
    username: 'emily.chen',
    email: 'emily@hrms.com',
    phone: '+1 555-0105',
    passwordHash: 'pass123',
    role: 'employee',
    department: 'Engineering',
    designation: 'QA Engineer',
    avatar: null,
    salary: null,
    createdAt: '2024-04-01',
    updatedAt: '2024-04-01',
  },
  {
    id: 'u6',
    firstName: 'Frank',
    lastName: 'Wilson',
    username: 'frank.wilson',
    email: 'frank@hrms.com',
    phone: '+1 555-0106',
    passwordHash: 'pass123',
    role: 'employee',
    department: 'Sales',
    designation: 'Sales Representative',
    avatar: null,
    salary: null,
    createdAt: '2024-04-15',
    updatedAt: '2024-04-15',
  },
  {
    id: 'hr1',
    firstName: 'Sarah',
    lastName: 'Parker',
    username: 'sarah.parker',
    email: 'hr@hrms.com',
    phone: '+1 555-0200',
    passwordHash: 'hr123',
    role: 'hr',
    department: 'Human Resources',
    designation: 'HR Officer',
    avatar: null,
    salary: null,
    createdAt: '2023-11-01',
    updatedAt: '2023-11-01',
  },
  {
    id: 'admin1',
    firstName: 'Michael',
    lastName: 'Torres',
    username: 'admin',
    email: 'admin@hrms.com',
    phone: '+1 555-0300',
    passwordHash: 'admin123',
    role: 'admin',
    department: 'Administration',
    designation: 'System Administrator',
    avatar: null,
    salary: null,
    createdAt: '2023-10-01',
    updatedAt: '2023-10-01',
  },
];

// ── Salary (confidential — only admin/hr can access) ─────────────────────────
export const salaries = [
  { id: 's1', employeeId: 'u1', baseSalary: 95000, bonus: 5000, deductions: 3000, netSalary: 97000, payPeriod: 'Monthly', effectiveDate: '2024-01-15', currency: 'USD' },
  { id: 's2', employeeId: 'u2', baseSalary: 88000, bonus: 3000, deductions: 2800, netSalary: 88200, payPeriod: 'Monthly', effectiveDate: '2024-02-10', currency: 'USD' },
  { id: 's3', employeeId: 'u3', baseSalary: 75000, bonus: 4000, deductions: 2500, netSalary: 76500, payPeriod: 'Monthly', effectiveDate: '2024-03-05', currency: 'USD' },
  { id: 's4', employeeId: 'u4', baseSalary: 65000, bonus: 2000, deductions: 2200, netSalary: 64800, payPeriod: 'Monthly', effectiveDate: '2024-03-20', currency: 'USD' },
  { id: 's5', employeeId: 'u5', baseSalary: 72000, bonus: 3500, deductions: 2400, netSalary: 73100, payPeriod: 'Monthly', effectiveDate: '2024-04-01', currency: 'USD' },
  { id: 's6', employeeId: 'u6', baseSalary: 60000, bonus: 8000, deductions: 2100, netSalary: 65900, payPeriod: 'Monthly', effectiveDate: '2024-04-15', currency: 'USD' },
  { id: 's7', employeeId: 'hr1', baseSalary: 80000, bonus: 3000, deductions: 2600, netSalary: 80400, payPeriod: 'Monthly', effectiveDate: '2023-11-01', currency: 'USD' },
];

// ── Attendance ───────────────────────────────────────────────────────────────
let attendanceIdCounter = 100;
export const attendance = [
  // Alice — last 5 days
  { id: 'a1',  employeeId: 'u1', date: fmt(subDays(today,4)), clockIn: '09:02', clockOut: '18:05', workingDuration: '9h 3m',  status: 'present' },
  { id: 'a2',  employeeId: 'u1', date: fmt(subDays(today,3)), clockIn: '08:55', clockOut: '17:58', workingDuration: '9h 3m',  status: 'present' },
  { id: 'a3',  employeeId: 'u1', date: fmt(subDays(today,2)), clockIn: '09:10', clockOut: '18:15', workingDuration: '9h 5m',  status: 'present' },
  { id: 'a4',  employeeId: 'u1', date: fmt(subDays(today,1)), clockIn: '09:00', clockOut: '18:00', workingDuration: '9h 0m',  status: 'present' },
  // Bob
  { id: 'a5',  employeeId: 'u2', date: fmt(subDays(today,4)), clockIn: '08:45', clockOut: '17:50', workingDuration: '9h 5m',  status: 'present' },
  { id: 'a6',  employeeId: 'u2', date: fmt(subDays(today,3)), clockIn: '09:05', clockOut: '18:10', workingDuration: '9h 5m',  status: 'present' },
  { id: 'a7',  employeeId: 'u2', date: fmt(subDays(today,2)), clockIn: '09:00', clockOut: '18:00', workingDuration: '9h 0m',  status: 'present' },
  // Carol
  { id: 'a8',  employeeId: 'u3', date: fmt(subDays(today,4)), clockIn: '10:00', clockOut: '19:00', workingDuration: '9h 0m',  status: 'present' },
  { id: 'a9',  employeeId: 'u3', date: fmt(subDays(today,2)), clockIn: '10:05', clockOut: '19:10', workingDuration: '9h 5m',  status: 'present' },
  // David
  { id: 'a10', employeeId: 'u4', date: fmt(subDays(today,3)), clockIn: '09:30', clockOut: '18:30', workingDuration: '9h 0m',  status: 'present' },
  { id: 'a11', employeeId: 'u4', date: fmt(subDays(today,1)), clockIn: '09:15', clockOut: '18:20', workingDuration: '9h 5m',  status: 'present' },
  // Emily
  { id: 'a12', employeeId: 'u5', date: fmt(subDays(today,4)), clockIn: '08:50', clockOut: '17:55', workingDuration: '9h 5m',  status: 'present' },
  { id: 'a13', employeeId: 'u5', date: fmt(subDays(today,3)), clockIn: '09:00', clockOut: '18:00', workingDuration: '9h 0m',  status: 'present' },
];

export function getNextAttendanceId() {
  return `a${++attendanceIdCounter}`;
}

// ── Leave Requests ───────────────────────────────────────────────────────────
let leaveIdCounter = 50;
export const leaveRequests = [
  {
    id: 'l1',
    employeeId: 'u1',
    type: 'Paid Time Off',
    startDate: fmt(addDays(today, 5)),
    endDate:   fmt(addDays(today, 7)),
    duration: 3,
    reason: 'Family vacation',
    attachment: null,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
    createdAt: fmt(subDays(today, 1)),
  },
  {
    id: 'l2',
    employeeId: 'u2',
    type: 'Sick Leave',
    startDate: fmt(subDays(today, 3)),
    endDate:   fmt(subDays(today, 2)),
    duration: 2,
    reason: 'Feeling unwell — fever',
    attachment: null,
    status: 'approved',
    reviewedBy: 'hr1',
    reviewedAt: fmt(subDays(today, 4)),
    createdAt: fmt(subDays(today, 5)),
  },
  {
    id: 'l3',
    employeeId: 'u3',
    type: 'Unpaid Leave',
    startDate: fmt(addDays(today, 10)),
    endDate:   fmt(addDays(today, 12)),
    duration: 3,
    reason: 'Personal matter',
    attachment: null,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
    createdAt: fmt(today),
  },
  {
    id: 'l4',
    employeeId: 'u4',
    type: 'Paid Time Off',
    startDate: fmt(subDays(today, 10)),
    endDate:   fmt(subDays(today, 8)),
    duration: 3,
    reason: 'Annual leave',
    attachment: null,
    status: 'rejected',
    reviewedBy: 'admin1',
    reviewedAt: fmt(subDays(today, 12)),
    createdAt: fmt(subDays(today, 15)),
  },
  {
    id: 'l5',
    employeeId: 'u5',
    type: 'Sick Leave',
    startDate: fmt(addDays(today, 2)),
    endDate:   fmt(addDays(today, 2)),
    duration: 1,
    reason: 'Medical appointment',
    attachment: null,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
    createdAt: fmt(today),
  },
  {
    id: 'l6',
    employeeId: 'u1',
    type: 'Sick Leave',
    startDate: fmt(subDays(today, 20)),
    endDate:   fmt(subDays(today, 19)),
    duration: 2,
    reason: 'Cold and flu',
    attachment: null,
    status: 'approved',
    reviewedBy: 'hr1',
    reviewedAt: fmt(subDays(today, 21)),
    createdAt: fmt(subDays(today, 22)),
  },
];

export function getNextLeaveId() {
  return `l${++leaveIdCounter}`;
}
