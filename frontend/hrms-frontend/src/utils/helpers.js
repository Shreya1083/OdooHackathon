import { format, parseISO, isValid } from 'date-fns';

export function formatDate(dateStr, pattern = 'MMM d, yyyy') {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return isValid(d) ? format(d, pattern) : '—';
  } catch {
    return '—';
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return '—';
  return timeStr;
}

export function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getFullName(user) {
  if (!user) return 'Unknown';
  return `${user.firstName} ${user.lastName}`.trim();
}

export function getRoleBadgeClass(role) {
  switch (role) {
    case 'admin': return 'badge bg-purple-100 text-purple-700';
    case 'hr':    return 'badge bg-brand-100 text-brand-700';
    default:      return 'badge bg-surface-100 text-surface-600';
  }
}

export function getStatusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case 'approved': return 'badge-approved';
    case 'rejected': return 'badge-rejected';
    case 'pending':  return 'badge-pending';
    case 'present':  return 'badge-approved';
    case 'absent':   return 'badge-rejected';
    default:         return 'badge-gray';
  }
}

export function getDepartmentColor(dept) {
  const map = {
    Engineering:     'bg-brand-100 text-brand-700',
    Design:          'bg-purple-100 text-purple-700',
    Marketing:       'bg-pink-100 text-pink-700',
    Sales:           'bg-orange-100 text-orange-700',
    'Human Resources': 'bg-teal-100 text-teal-700',
    Administration:  'bg-gray-100 text-gray-700',
  };
  return map[dept] || 'bg-surface-100 text-surface-600';
}

export function pluralize(count, word) {
  return `${count} ${word}${count !== 1 ? 's' : ''}`;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
