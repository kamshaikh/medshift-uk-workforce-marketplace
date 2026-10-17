import React from 'react';
import { Shift } from '../../types';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import {
  Clock,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';

interface ShiftCardProps {
  shift: Shift;
  userRole: 'hospital' | 'professional';
  onViewDetails?: (shift: Shift) => void;
  onAcceptShift?: (shiftId: string) => void;
  onFindMatch?: (shift: Shift) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  userRole,
  onViewDetails,
  onAcceptShift,
  onFindMatch,
}) => {
  const isFilled = shift.status === 'Filled';
  const isMatched = shift.status === 'Matched';

  return (
    <Card hoverEffect padding="none" className="overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        {/* Top row: Specialty & Status */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {shift.specialty}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {shift.profession}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{shift.department}</p>
          </div>
          <StatusBadge status={shift.status} />
        </div>

        {/* Hospital & Location info */}
        <div className="space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-350">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200">{shift.hospitalName}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">{shift.trustName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {shift.city} ({shift.locationDetails})
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="flex items-center gap-1 font-medium text-slate-900 dark:text-slate-100">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>{shift.dateLabel}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="tabular-nums font-mono">
                {shift.startTime} - {shift.endTime} ({shift.durationHours} hrs)
              </span>
            </span>
          </div>
        </div>

        {/* Notes preview if available */}
        {shift.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 bg-slate-50 dark:bg-slate-850 p-2 rounded border border-slate-100 dark:border-slate-800 mt-2">
            {shift.notes}
          </p>
        )}

        {/* Matched/Filled by indicator */}
        {isFilled && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-200/80 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>
              Filled by{' '}
              <strong>{shift.filledByProfessionalName || 'Confirmed Clinician'}</strong>
            </span>
          </div>
        )}

        {isMatched && !isFilled && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded border border-purple-200/80 dark:border-purple-800">
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span>
              Matched with{' '}
              <strong>{shift.matchedCandidateName || 'Specialist Candidate'}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Card Footer: Pay & Action */}
      <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 block leading-tight">Remuneration</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              £{shift.hourlyRate}/hr
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              (£{shift.totalPay})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(shift)}
            >
              Details
            </Button>
          )}

          {userRole === 'professional' && !isFilled && onAcceptShift && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAcceptShift(shift.id)}
            >
              Accept Shift
            </Button>
          )}

          {userRole === 'hospital' && !isFilled && onFindMatch && (
            <Button
              variant={shift.status === 'Urgent' ? 'danger' : 'primary'}
              size="sm"
              onClick={() => onFindMatch(shift)}
            >
              Match
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
