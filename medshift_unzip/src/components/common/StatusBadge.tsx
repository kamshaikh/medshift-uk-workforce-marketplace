import React from 'react';
import { ShiftStatus, ShiftPriority } from '../../types';
import {
  Clock,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  Send,
  Sparkles,
  XCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: ShiftStatus | ShiftPriority;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  switch (status) {
    case 'Urgent':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses} ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Urgent</span>
        </span>
      );
    case 'High':
    case 'High Priority':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200/90 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses} ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>High Priority</span>
        </span>
      );
    case 'Open':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-teal-50 text-teal-700 border border-teal-200/90 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses} ${className}`}
        >
          <Clock className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Open</span>
        </span>
      );
    case 'Matching':
    case 'Matched':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200/90 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses} ${className}`}
        >
          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
          <span>{status === 'Matching' ? 'Matching' : 'Matched'}</span>
        </span>
      );
    case 'Invited':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/90 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses} ${className}`}
        >
          <Send className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Invited</span>
        </span>
      );
    case 'Booked':
    case 'Filled':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{status === 'Booked' ? 'Booked' : 'Filled'}</span>
        </span>
      );
    case 'Cancelled':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses} ${className}`}
        >
          <XCircle className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Cancelled</span>
        </span>
      );
    case 'Normal':
    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200/90 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses} ${className}`}
        >
          <span>Normal</span>
        </span>
      );
  }
};
