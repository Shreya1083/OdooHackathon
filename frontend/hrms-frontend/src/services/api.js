// ─── API Service Layer ───────────────────────────────────────────────────────
// Simulates async backend calls with role-based authorization guards.
// In production, replace each function body with a real HTTP call.

import {
  users,
  salaries,
  attendance,
  leaveRequests,
  getNextAttendanceId,
  getNextLeaveId,
} from '../data/mockData.js';
import { differenceInCalendarDays, format } from 'date-fns';

const STORAGE_KEY = 'hrms_session';

// ── Helpers ──────────────────────────────────────────────────────────────────
function delay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms));
}

function currentSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function assertAuth() {
  const session = currentSession();
  if (!session) throw new Error('Not authenticated');
  return session;
}

function assertRole(...roles) {
  const session = assertAuth();
  if (!roles.includes(session.role)) {
    throw new Error('Access denied: insufficient permissions');
  }
  return session;
}

function sanitizeUser(user) {
  // Strip password and salary from user objects before returning
  const { passwordHash, ...safe } = user; // eslint-disable-line no-unused-vars
  return safe;
}

function sanitizeUserPublic(user) {
  // For employee-visible profiles — also strip salary field
  const { passwordHash, salary, ...pub } = user; // eslint-disable-line no-unused-vars
  return pub;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function apiLogin({ email, password }) {
  await delay();
  const user = users.find(
    (u) =>
      (u.email === email || u.username === email) &&
      u.passwordHash === password
  );
  if (!user) throw new Error('Invalid email or password');

  const session = {
    userId: user.id,
    role: user.role,
    token: `mock-token-${user.id}-${Date.now()}`,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return { user: sanitizeUser(user), session };
}

export async function apiSignup(data) {
  await delay();
  const { firstName, lastName, username, email, phone, password, confirmPassword, avatar } = data;

  if (!firstName?.trim()) throw new Error('First name is required');
  if (!lastName?.trim()) throw new Error('Last name is required');
  if (!username?.trim()) throw new Error('Username is required');
  if (!email?.trim()) throw new Error('Email is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address');
  if (!password) throw new Error('Password is required');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  if (password !== confirmPassword) throw new Error('Passwords do not match');
  if (users.find((u) => u.email === email)) throw new Error('Email already registered');
  if (users.find((u) => u.username === username)) throw new Error('Username already taken');

  const newUser = {
    id: `u${Date.now()}`,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || '',
    passwordHash: password,
    role: 'employee',
    department: 'Unassigned',
    designation: 'New Employee',
    avatar: avatar || null,
    salary: null,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  };

  users.push(newUser);

  const session = {
    userId: newUser.id,
    role: newUser.role,
    token: `mock-token-${newUser.id}-${Date.now()}`,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return { user: sanitizeUser(newUser), session };
}

export async function apiLogout() {
  await delay(100);
  localStorage.removeItem(STORAGE_KEY);
}

export async function apiGetCurrentUser() {
  await delay(200);
  const session = assertAuth();
  const user = users.find((u) => u.id === session.userId);
  if (!user) throw new Error('User not found');
  return sanitizeUser(user);
}

// ── Users ────────────────────────────────────────────────────────────────────
export async function apiGetAllEmployees() {
  await delay();
  assertAuth();
  // All authenticated users can see basic employee info (no salary, no password)
  return users
    .filter((u) => u.role === 'employee')
    .map(sanitizeUserPublic);
}

export async function apiGetAllUsers() {
  await delay();
  assertRole('admin', 'hr');
  return users.map(sanitizeUser);
}

export async function apiGetUserById(id) {
  await delay(200);
  const session = assertAuth();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error('User not found');

  // If requesting own profile — return full safe profile
  if (session.userId === id) return sanitizeUser(user);

  // Employees can only see public info of others
  if (session.role === 'employee') return sanitizeUserPublic(user);

  // HR/Admin can see full info
  return sanitizeUser(user);
}

export async function apiUpdateProfile(id, updates) {
  await delay();
  const session = assertAuth();

  // Employees can only edit their own profile
  if (session.role === 'employee' && session.userId !== id) {
    throw new Error('Access denied: cannot edit another employee profile');
  }

  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found');

  // Prevent role escalation
  const { role, passwordHash, salary, ...safeUpdates } = updates; // eslint-disable-line no-unused-vars
  users[idx] = {
    ...users[idx],
    ...safeUpdates,
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  };
  return sanitizeUser(users[idx]);
}

export async function apiUpdateUserByAdmin(id, updates) {
  await delay();
  assertRole('admin', 'hr');
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found');

  const { passwordHash, ...safeUpdates } = updates; // eslint-disable-line no-unused-vars
  users[idx] = { ...users[idx], ...safeUpdates, updatedAt: format(new Date(), 'yyyy-MM-dd') };
  return sanitizeUser(users[idx]);
}

export async function apiDeleteUser(id) {
  await delay();
  assertRole('admin');
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found');
  users.splice(idx, 1);
  return { success: true };
}

// ── Attendance ────────────────────────────────────────────────────────────────
export async function apiGetMyAttendance() {
  await delay();
  const session = assertAuth();
  return attendance
    .filter((a) => a.employeeId === session.userId)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function apiGetAllAttendance() {
  await delay();
  assertRole('admin', 'hr');
  return attendance
    .map((a) => {
      const emp = users.find((u) => u.id === a.employeeId);
      return {
        ...a,
        employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        department: emp?.department || '-',
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function apiClockIn() {
  await delay();
  const session = assertAuth();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const existing = attendance.find(
    (a) => a.employeeId === session.userId && a.date === todayStr
  );
  if (existing) throw new Error('Already clocked in for today');

  const record = {
    id: getNextAttendanceId(),
    employeeId: session.userId,
    date: todayStr,
    clockIn: format(new Date(), 'HH:mm'),
    clockOut: null,
    workingDuration: null,
    status: 'present',
  };
  attendance.unshift(record);
  return record;
}

export async function apiClockOut() {
  await delay();
  const session = assertAuth();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const idx = attendance.findIndex(
    (a) => a.employeeId === session.userId && a.date === todayStr
  );
  if (idx === -1) throw new Error('You have not clocked in today');
  if (attendance[idx].clockOut) throw new Error('Already clocked out for today');

  const now = format(new Date(), 'HH:mm');
  const [inH, inM] = attendance[idx].clockIn.split(':').map(Number);
  const [outH, outM] = now.split(':').map(Number);
  const totalMin = (outH * 60 + outM) - (inH * 60 + inM);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;

  attendance[idx] = {
    ...attendance[idx],
    clockOut: now,
    workingDuration: `${h}h ${m}m`,
  };
  return attendance[idx];
}

export async function apiGetTodayAttendance() {
  await delay(200);
  const session = assertAuth();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  return attendance.find(
    (a) => a.employeeId === session.userId && a.date === todayStr
  ) || null;
}

// ── Leave ─────────────────────────────────────────────────────────────────────
export async function apiGetMyLeaves() {
  await delay();
  const session = assertAuth();
  // CRITICAL: filter by logged-in user only — never trust client-supplied IDs
  return leaveRequests
    .filter((l) => l.employeeId === session.userId)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function apiGetAllLeaves() {
  await delay();
  assertRole('admin', 'hr');
  return leaveRequests
    .map((l) => {
      const emp = users.find((u) => u.id === l.employeeId);
      const reviewer = l.reviewedBy ? users.find((u) => u.id === l.reviewedBy) : null;
      return {
        ...l,
        employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        department: emp?.department || '-',
        reviewerName: reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : null,
      };
    })
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function apiCreateLeave(data) {
  await delay();
  const session = assertAuth();
  const { type, startDate, endDate, reason, attachment } = data;

  if (!type) throw new Error('Leave type is required');
  if (!startDate) throw new Error('Start date is required');
  if (!endDate) throw new Error('End date is required');
  if (!reason?.trim()) throw new Error('Reason is required');
  if (new Date(endDate) < new Date(startDate)) throw new Error('End date must be after start date');

  const duration = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;

  const leave = {
    id: getNextLeaveId(),
    employeeId: session.userId, // Always use session userId — never trust frontend
    type,
    startDate,
    endDate,
    duration,
    reason: reason.trim(),
    attachment: attachment || null,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  };

  leaveRequests.unshift(leave);
  return leave;
}

export async function apiReviewLeave(leaveId, action) {
  await delay();
  const session = assertRole('admin', 'hr');

  const idx = leaveRequests.findIndex((l) => l.id === leaveId);
  if (idx === -1) throw new Error('Leave request not found');
  if (leaveRequests[idx].status !== 'pending') throw new Error('Only pending requests can be reviewed');
  if (!['approved', 'rejected'].includes(action)) throw new Error('Invalid action');

  leaveRequests[idx] = {
    ...leaveRequests[idx],
    status: action,
    reviewedBy: session.userId,
    reviewedAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  };
  return leaveRequests[idx];
}

// ── Salary (CONFIDENTIAL — admin/hr only) ────────────────────────────────────
export async function apiGetAllSalaries() {
  await delay();
  assertRole('admin', 'hr'); // Backend guard — never returns for employees
  return salaries.map((s) => {
    const emp = users.find((u) => u.id === s.employeeId);
    return {
      ...s,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
      department: emp?.department || '-',
      designation: emp?.designation || '-',
    };
  });
}

export async function apiUpdateSalary(employeeId, updates) {
  await delay();
  assertRole('admin', 'hr');
  const idx = salaries.findIndex((s) => s.employeeId === employeeId);
  if (idx === -1) {
    // Create new salary record
    const newRecord = {
      id: `s${Date.now()}`,
      employeeId,
      baseSalary: updates.baseSalary || 0,
      bonus: updates.bonus || 0,
      deductions: updates.deductions || 0,
      netSalary: (updates.baseSalary || 0) + (updates.bonus || 0) - (updates.deductions || 0),
      payPeriod: updates.payPeriod || 'Monthly',
      effectiveDate: format(new Date(), 'yyyy-MM-dd'),
      currency: 'USD',
    };
    salaries.push(newRecord);
    return newRecord;
  }
  salaries[idx] = {
    ...salaries[idx],
    ...updates,
    netSalary: (updates.baseSalary || salaries[idx].baseSalary) +
               (updates.bonus || salaries[idx].bonus) -
               (updates.deductions || salaries[idx].deductions),
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
  };
  return salaries[idx];
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export async function apiGetAdminStats() {
  await delay();
  assertRole('admin', 'hr');

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const totalEmployees = users.filter((u) => u.role === 'employee').length;
  const presentToday = attendance.filter((a) => a.date === todayStr).length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending').length;
  const approvedLeaves = leaveRequests.filter((l) => l.status === 'approved').length;

  return { totalEmployees, presentToday, pendingLeaves, approvedLeaves };
}
