import { getInitials } from '../../utils/helpers.js';

const sizeMap = {
  xs:  'w-6 h-6 text-xs',
  sm:  'w-8 h-8 text-xs',
  md:  'w-10 h-10 text-sm',
  lg:  'w-14 h-14 text-lg',
  xl:  'w-20 h-20 text-2xl',
  '2xl': 'w-28 h-28 text-3xl',
};

const colorMap = [
  'bg-brand-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-emerald-500',
  'bg-indigo-500',
];

function getColor(name = '') {
  const idx = name.charCodeAt(0) % colorMap.length;
  return colorMap[idx];
}

export default function Avatar({ user, size = 'md', className = '' }) {
  const sizeClass = sizeMap[size] || sizeMap.md;
  const initials  = getInitials(user?.firstName, user?.lastName);
  const color     = getColor(user?.firstName);

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={`${user.firstName} ${user.lastName}`}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full ${color} text-white font-semibold flex items-center justify-center ring-2 ring-white flex-shrink-0 ${className}`}
      aria-label={`${user?.firstName} ${user?.lastName}`}
    >
      {initials}
    </div>
  );
}
