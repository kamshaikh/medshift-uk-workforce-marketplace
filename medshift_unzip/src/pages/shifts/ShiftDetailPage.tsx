import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { calculateMatchScore } from '../../utils/matching';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ArrowLeft,
  Info,
} from 'lucide-react';

export const ShiftDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    shifts,
    professionalUser,
    acceptShiftByProfessional,
    toggleSaveShift,
    savedShiftIds,
  } = useApp();
  const { showToast } = useToast();

  const shift = shifts.find((s) => s.id === id);

  if (!shift) {
    return (
      <EmptyState
        icon={<Clock className="w-6 h-6" />}
        title="Shift Not Found"
        description="The clinical shift you are trying to view no longer exists or has been removed."
        actionLabel="Browse Available Shifts"
        onAction={() => navigate('/professional/shifts')}
      />
    );
  }

  // Calculate match against current clinician
  const matchResult = calculateMatchScore(shift, professionalUser);

  const isBookedByMe =
    shift.status === 'Filled' &&
    (shift.filledByProfessionalId === professionalUser.id ||
      shift.matchedCandidateId === professionalUser.id);

  const isSaved = savedShiftIds.includes(shift.id);

  const handleAccept = () => {
    acceptShiftByProfessional(shift.id);
    showToast(
      'Shift Confirmed & Booked',
      `You have confirmed ${shift.specialty} at ${shift.hospitalName}. Added to your clinical rota.`,
      'success'
    );
  };

  const handleToggleSave = () => {
    const newlySaved = toggleSaveShift(shift.id);
    showToast(
      newlySaved ? 'Shift Saved' : 'Shift Removed from Saved',
      newlySaved ? 'Added to your favorites list.' : 'Removed from your favorites.',
      'info'
    );
  };

  const handleDecline = () => {
    showToast(
      'Shift Declined (Demo)',
      `Shift preference recorded in session state.`,
      'info'
    );
    navigate('/professional/shifts');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        title={`${shift.specialty} ${shift.profession} Shift`}
        description={`${shift.hospitalName} · ${shift.trustName} · ${shift.department}`}
        breadcrumbs={[
          { label: 'Clinician', href: '/professional/dashboard' },
          { label: 'Find Shifts', href: '/professional/shifts' },
          { label: `${shift.specialty} Details` },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/professional/shifts')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Shifts
          </Button>
        }
      />

      {/* Main Shift Summary Card */}
      <Card padding="lg" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <StatusBadge status={shift.status} />
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {shift.priority}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300">
                {shift.profession}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {shift.specialty} Clinical Cover
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hospital: <strong className="text-slate-800 dark:text-slate-200">{shift.hospitalName}</strong> ({shift.trustName})
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 block leading-tight">Total Shift Remuneration</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              £{shift.totalPay}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
              £{shift.hourlyRate}/hr · {shift.durationHours} hours
            </span>
          </div>
        </div>

        {/* Shift Details Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Date
            </span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{shift.dateLabel}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Hours
            </span>
            <p className="font-bold text-slate-900 dark:text-white font-mono text-sm">
              {shift.startTime} - {shift.endTime}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">({shift.durationHours} hours)</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Location & Ward
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{shift.city}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{shift.locationDetails}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Experience Req.
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{shift.requiredExperienceYears}+ Years</p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Demo Verified</p>
          </div>
        </div>

        {/* Handover & Description */}
        <div className="py-6 border-b border-slate-100 dark:border-slate-800 text-xs space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Shift Briefing & Description
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
            {shift.notes || 'Ward handover and department orientation provided upon arrival. Free staff parking available in Car Park B.'}
          </p>
        </div>

        {/* "Why This Shift Matches You" Checklist */}
        <div className="py-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Why This Shift Matches You</span>
            </h3>

            <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
              {matchResult.score}% Compatibility Score
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {matchResult.reasons.map((reason, idx) => {
              const isPositive = reason.startsWith('✓');
              const isPartial = reason.startsWith('~');

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-center gap-2 ${
                    isPositive
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
                      : isPartial
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300'
                      : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  <span className="font-bold">{reason.slice(0, 1)}</span>
                  <span>{reason.slice(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant={isSaved ? 'secondary' : 'outline'}
              size="md"
              onClick={handleToggleSave}
              icon={<Bookmark className="w-4 h-4" />}
            >
              {isSaved ? 'Saved to Favorites' : 'Save Shift'}
            </Button>

            {!isBookedByMe && shift.status !== 'Filled' && (
              <Button
                variant="ghost"
                size="md"
                onClick={handleDecline}
              >
                Decline
              </Button>
            )}
          </div>

          <div className="w-full sm:w-auto">
            {isBookedByMe ? (
              <div className="flex items-center gap-2 p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold text-xs rounded-lg px-4 py-2.5 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>You have accepted this shift (Confirmed on Rota)</span>
              </div>
            ) : shift.status === 'Filled' ? (
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-lg px-4 py-2.5">
                This shift is already filled by another clinician.
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleAccept}
                className="w-full sm:w-auto"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              >
                Accept Shift
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
