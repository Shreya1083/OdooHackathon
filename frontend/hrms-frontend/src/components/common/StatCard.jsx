import { TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, iconBg = 'bg-brand-100', iconColor = 'text-brand-600', trend }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon size={22} className={iconColor} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-surface-900 mt-0.5">{value ?? '—'}</p>
        {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
        {trend !== undefined && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            <TrendingUp size={11} />
            {trend >= 0 ? '+' : ''}{trend}% this month
          </p>
        )}
      </div>
    </div>
  );
}
