import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    rose: 'bg-rose-50 text-rose-800 border border-rose-200/80',
    purple: 'bg-purple-50 text-purple-800 border border-purple-200/80',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md tracking-tight whitespace-nowrap shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
