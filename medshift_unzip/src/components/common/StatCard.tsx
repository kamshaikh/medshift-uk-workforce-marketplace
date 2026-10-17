import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    period?: string;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300',
  onClick,
}) => {
  return (
    <Card
      padding="md"
      hoverEffect={!!onClick}
      className={onClick ? 'cursor-pointer' : ''}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold tabular-nums ${
                  trend.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 ${iconBgColor}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
