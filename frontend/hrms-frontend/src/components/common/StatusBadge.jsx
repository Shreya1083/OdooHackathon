import { getStatusBadgeClass } from '../../utils/helpers.js';
import { CheckCircle, XCircle, Clock, Circle } from 'lucide-react';

const icons = {
  approved: CheckCircle,
  rejected: XCircle,
  pending:  Clock,
  present:  CheckCircle,
  absent:   XCircle,
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const normalized = status.toLowerCase();
  const badgeClass = getStatusBadgeClass(normalized);
  const Icon = icons[normalized] || Circle;
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={badgeClass}>
      <Icon size={11} />
      {label}
    </span>
  );
}
