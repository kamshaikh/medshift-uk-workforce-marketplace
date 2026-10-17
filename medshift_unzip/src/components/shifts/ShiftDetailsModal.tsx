import React from 'react';
import { Shift, HealthcareProfessional } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  CreditCard,
  UserCheck,
} from 'lucide-react';

interface ShiftDetailsModalProps {
  shift: Shift | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: 'hospital' | 'professional';
  professionals: HealthcareProfessional[];
  onMatchCandidate?: (shiftId: string, professionalId: string, professionalName: string) => void;
  onAcceptShift?: (shiftId: string) => void;
}

export const ShiftDetailsModal: React.FC<ShiftDetailsModalProps> = ({
  shift,
  isOpen,
  onClose,
  userRole,
  professionals,
  onMatchCandidate,
  onAcceptShift,
}) => {
  if (!shift) return null;

  // Find suitable professionals matching specialty & profession
  const matchingCandidates = professionals.filter(
    (p) => p.profession === shift.profession || p.specialty === shift.specialty
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${shift.specialty} ${shift.profession} Shift`}
      description={`${shift.hospitalName} · ${shift.trustName}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Header badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <StatusBadge status={shift.status} />
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {shift.priority}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block leading-tight">Total Payment</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              £{shift.totalPay}{' '}
              <span className="text-xs text-slate-500 font-normal">
                (£{shift.hourlyRate}/hr · {shift.durationHours} hrs)
              </span>
            </span>
          </div>
        </div>

        {/* Location & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">{shift.hospitalName}</p>
                <p className="text-slate-500">{shift.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-700">{shift.locationDetails}</p>
                <p className="text-slate-500">{shift.city}, United Kingdom</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">{shift.dateLabel}</p>
                <p className="text-slate-500">Immediate Rota Allocation</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 tabular-nums">
                  {shift.startTime} - {shift.endTime}
                </p>
                <p className="text-slate-500">{shift.durationHours} hours duration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Requirements & Notes */}
        <div className="space-y-2 text-xs">
          <h4 className="font-semibold text-slate-900">Clinical Requirements & Compliance</h4>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div className="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>GMC / NMC Active Pin Required</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
              <Award className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Min. {shift.requiredExperienceYears} Years Experience</span>
            </div>
          </div>
          {shift.notes && (
            <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
              <strong>Notes:</strong> {shift.notes}
            </p>
          )}
        </div>

        {/* Current Fill / Match Status */}
        {shift.status === 'Filled' ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-emerald-900">Shift Confirmed & Booked</p>
              <p className="text-emerald-700">
                Filled by {shift.filledByProfessionalName || 'Confirmed Clinician'}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-200">
              Induction Ready
            </span>
          </div>
        ) : userRole === 'hospital' ? (
          /* Hospital View: Candidate Matching Pool */
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Available Verified Professionals ({matchingCandidates.length} matched)</span>
              </h4>
              <span className="text-[11px] text-slate-500">Specialty & City Match</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {matchingCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      initials={candidate.avatarInitials}
                      gradient={candidate.avatarColor}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {candidate.name}
                      </p>
                      <p className="text-slate-500 text-[11px] truncate">
                        {candidate.specialty} · {candidate.city} · {candidate.experienceYears}y exp
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono tabular-nums text-slate-700 font-medium">
                      £{candidate.hourlyRate}/hr
                    </span>
                    {onMatchCandidate && (
                      <Button
                        variant={shift.matchedCandidateId === candidate.id ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => {
                          onMatchCandidate(shift.id, candidate.id, candidate.name);
                        }}
                      >
                        {shift.matchedCandidateId === candidate.id ? 'Matched' : 'Assign'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Professional View: Direct Accept */
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Instant Rota Confirmation</p>
              <p>Direct electronic contract with {shift.hospitalName}</p>
            </div>
            {onAcceptShift && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  onAcceptShift(shift.id);
                  onClose();
                }}
              >
                Accept & Confirm Shift
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
