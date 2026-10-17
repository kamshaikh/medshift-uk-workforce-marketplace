import React from 'react';

interface AvatarProps {
  initials: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  gradient?: string;
  status?: 'Available' | 'On Shift' | 'Resting';
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  name,
  size = 'md',
  className = '',
  gradient = 'from-blue-600 to-indigo-700',
  status,
}) => {
  const sizeStyles = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg',
  };

  const statusIndicatorStyles = {
    sm: 'w-2 h-2 bottom-0 right-0 border',
    md: 'w-2.5 h-2.5 bottom-0 right-0 border-2',
    lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5 border-2',
    xl: 'w-4 h-4 bottom-1 right-1 border-2',
  };

  const statusColor =
    status === 'Available'
      ? 'bg-emerald-500'
      : status === 'On Shift'
      ? 'bg-blue-500'
      : 'bg-slate-400';

  return (
    <div className="relative inline-block shrink-0" title={name || initials}>
      <div
        className={`rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-tr ${gradient} shadow-xs select-none ${sizeStyles[size]} ${className}`}
      >
        <span>{initials}</span>
      </div>
      {status && (
        <span
          className={`absolute rounded-full border-white ${statusColor} ${statusIndicatorStyles[size]}`}
          title={`Status: ${status}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};
