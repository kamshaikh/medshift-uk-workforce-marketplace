import React from 'react';
import { HealthcareProfessional } from '../../types';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import {
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';

interface ProfessionalDetailsModalProps {
  professional: HealthcareProfessional | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForShift?: (professional: HealthcareProfessional) => void;
}

export const ProfessionalDetailsModal: React.FC<ProfessionalDetailsModalProps> = ({
  professional,
  isOpen,
  onClose,
  onSelectForShift,
}) => {
  if (!professional) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={professional.name}
      description={`${professional.specialty} · ${professional.profession}`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Profile Card Header */}
        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <Avatar
            initials={professional.avatarInitials}
            name={professional.name}
            gradient={professional.avatarColor}
            size="xl"
            status={professional.currentStatus}
          />
          <div className="flex-1 min-w-0 text-xs">
            <h3 className="text-base font-bold text-slate-900">{professional.title}</h3>
            <p className="text-slate-600 mt-0.5">{professional.subSpecialty || professional.specialty}</p>

            <div className="flex items-center gap-3 mt-2 text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{professional.city}</span>
              </span>
              <span>·</span>
              <span className="font-semibold text-slate-900 font-mono">
                £{professional.hourlyRate}/hr
              </span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">{professional.currentStatus}</span>
            </div>
          </div>
        </div>

        {/* Credentials & Trust Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Regulatory Registration</p>
              <p className="text-slate-500 font-mono">{professional.gmcOrNmcNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Enhanced DBS Check</p>
              <p className="text-slate-500">Active & Continuous Monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg">
            <Building className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Clinical Affiliations</p>
              <p className="text-slate-500 truncate">{professional.hospitalAffiliation}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Clinical Track Record</p>
              <p className="text-slate-500">
                {professional.completedShiftsCount} shifts · {professional.rating} / 5.0
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="text-xs">
          <h4 className="font-semibold text-slate-900 mb-1">Clinical Background</h4>
          <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            {professional.bio}
          </p>
        </div>

        {/* Availability & Preferred Shifts */}
        <div className="space-y-2 text-xs">
          <h4 className="font-semibold text-slate-900">Weekly Availability Pattern</h4>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const isAvailable = professional.availabilityDays.includes(day as any);
              return (
                <span
                  key={day}
                  className={`px-2.5 py-1 rounded text-xs font-medium border ${
                    isAvailable
                      ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                      : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-slate-500 pt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Preferred Shifttypes:</span>
            <span className="font-medium text-slate-700">
              {professional.preferredShiftTypes.join(', ')}
            </span>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{professional.contactEmail}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{professional.contactPhone}</span>
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {onSelectForShift && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onSelectForShift(professional);
                onClose();
              }}
            >
              Request for Open Rota
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
