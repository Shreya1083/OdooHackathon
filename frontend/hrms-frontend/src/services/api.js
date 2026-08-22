// ─── API Service Layer ───────────────────────────────────────────────────────
// Real backend integration using axios

import apiClient from './apiClient.js';

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function apiLogin({ email, password }) {
  const response = await apiClient.post('/auth/login', { email, password });
  
  // Backend returns: { success: true, data: { _id, name, email, role, token }, message }
  const userData = response.data.data || response.data;
  const token = userData.token;
  const user = {
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    employeeId: userData.employeeId,
    department: userData.department
  };
  
  // Store token and user in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return { user, session: { token, userId: user._id, role: user.role } };
}

export async function apiSignup(data) {
  const response = await apiClient.post('/auth/signup', {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    password: data.password,
    phone: data.phone,
    username: data.username,
    role: data.role || 'employee'
  });
  
  // Backend returns: { success: true, data: { _id, name, email, role, token }, message }
  const userData = response.data.data || response.data;
  const token = userData.token;
  const user = {
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    employeeId: userData.employeeId,
    department: userData.department
  };
  
  // Store token and user in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return { user, session: { token, userId: user._id, role: user.role } };
}

export async function apiLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function apiGetCurrentUser() {
  const response = await apiClient.get('/users/profile');
  return response.data.user;
}

// ── Users ────────────────────────────────────────────────────────────────────
export async function apiGetAllEmployees() {
  const response = await apiClient.get('/admin/users');
  return response.data.data || response.data;
}

export async function apiGetAllUsers() {
  const response = await apiClient.get('/admin/users');
  return response.data.data || response.data;
}

export async function apiGetUserById(id) {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data.data || response.data;
}

export async function apiUpdateProfile(id, updates) {
  const response = await apiClient.put(`/users/profile`, updates);
  return response.data.data || response.data;
}

export async function apiUpdateUserByAdmin(id, updates) {
  const response = await apiClient.put(`/admin/users/${id}`, updates);
  return response.data.data || response.data;
}

export async function apiDeleteUser(id) {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
}

// ── Attendance ────────────────────────────────────────────────────────────────
export async function apiGetMyAttendance() {
  const response = await apiClient.get('/attendance/my');
  return response.data.data || response.data;
}

export async function apiGetAllAttendance() {
  const response = await apiClient.get('/attendance/all');
  return response.data.data || response.data;
}

export async function apiClockIn() {
  const response = await apiClient.post('/attendance/checkin');
  return response.data.data || response.data;
}

export async function apiClockOut() {
  const response = await apiClient.post('/attendance/checkout');
  return response.data.data || response.data;
}

export async function apiGetTodayAttendance() {
  const response = await apiClient.get('/attendance/my');
  return response.data.data || response.data;
}

export async function apiGetAttendanceByUser(userId) {
  const response = await apiClient.get(`/attendance/user/${userId}`);
  return response.data.data || response.data;
}

// ── Leave ─────────────────────────────────────────────────────────────────────
export async function apiGetMyLeaves() {
  const response = await apiClient.get('/leave/my');
  return response.data.data || response.data;
}

export async function apiGetAllLeaves() {
  const response = await apiClient.get('/leave/all');
  return response.data.data || response.data;
}

export async function apiCreateLeave(data) {
  const response = await apiClient.post('/leave/apply', data);
  return response.data.data || response.data;
}

export async function apiReviewLeave(leaveId, status, rejectionReason) {
  const response = await apiClient.put(`/leave/${leaveId}`, { status, rejectionReason });
  return response.data.data || response.data;
}

// ── Salary (CONFIDENTIAL — admin/hr only) ────────────────────────────────────
export async function apiGetAllSalaries() {
  const response = await apiClient.get('/admin/payroll');
  return response.data.data || response.data;
}

export async function apiUpdateSalary(employeeId, updates) {
  const response = await apiClient.put(`/admin/payroll/${employeeId}`, updates);
  return response.data.data || response.data;
}

// ── Salary (Employee - own salary) ────────────────────────────────────────────
export async function apiGetMySalary(month, year) {
  const params = {};
  if (month) params.month = month;
  if (year) params.year = year;
  
  const response = await apiClient.get('/payroll/my', { params });
  return response.data.data || response.data;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export async function apiGetAdminStats() {
  const response = await apiClient.get('/admin/stats');
  return response.data.data || response.data;
}
