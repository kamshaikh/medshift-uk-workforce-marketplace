import React, { useState } from 'react';
import { HealthcareProfessional, Shift } from '../../types';
import { Button } from '../common/Button';
import {
  Send,
  X,
  Building2,
  Calendar,
  Clock,
  MapPin,
  PoundSterling,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: HealthcareProfessional | null;
  shift: Shift | null;
  onConfirmInvite: (professionalId: string, customNote?: string) => void;
}

export const InvitationModal: React.FC<InvitationModalProps> = ({
  isOpen,
  onClose,
  professional,
  shift,
  onConfirmInvite,
}) => {
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !professional || !shift) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmInvite(professional.id, customNote.trim() || undefined);
      setIsSubmitting(false);
      setCustomNote('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Invite Professional to Shift
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confirm shift dispatch and notification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Professional Overview Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3.5">
            <Avatar
              initials={professional.avatarInitials}
              name={professional.name}
              gradient={professional.avatarColor}
              size="lg"
              status={professional.currentStatus}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {professional.name}
                </h4>
                <span className="inline-flex items-center text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  Demo Verified
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {professional.specialty} · {professional.profession} ({professional.experienceYears}y exp)
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {professional.city}
                </span>
                <span>·</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  £{professional.hourlyRate}/hr
                </span>
              </div>
            </div>
          </div>

          {/* Shift Details Box */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Shift Requirement
              </span>
              <span className="font-semibold px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {shift.priority}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Hospital & Dept
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {shift.hospitalName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {shift.department}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date & Schedule
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {shift.dateLabel}
                </p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {shift.startTime} - {shift.endTime} ({shift.durationHours}h)
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Total Estimated Remuneration:</span>
              <span className="text-sm font-bold text-teal-700 dark:text-teal-400 font-mono">
                £{shift.totalPay} (£{shift.hourlyRate}/hr)
              </span>
            </div>
          </div>

          {/* Optional Direct Note */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Add message to clinician <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Please report to Acute Assessment Unit Ward 4B on arrival. Rapid triage experience appreciated."
              rows={2}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Prototype Simulation Disclosure */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-xs">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="font-semibold">Simulated Prototype Invitation:</strong> Sending this invitation updates the shift rota state and posts a simulated alert to the clinician's notification center. No external emails or SMS are sent.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Confirm & Send Invitation
          </Button>
        </div>
      </div>
    </div>
  );
};
