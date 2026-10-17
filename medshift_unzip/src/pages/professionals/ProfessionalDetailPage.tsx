import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { InvitationModal } from '../../components/hospital/InvitationModal';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Award,
  Globe,
  Calendar,
  Send,
  MessageSquare,
  ArrowLeft,
  FileCheck,
  Heart,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Shift } from '../../types';

export const ProfessionalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    professionals,
    shifts,
    inviteProfessionalToShift,
    role,
    favoriteProfessionalIds,
    toggleFavoriteProfessional,
  } = useApp();
  const { showToast } = useToast();

  const [isSelectShiftModalOpen, setIsSelectShiftModalOpen] = useState(false);
  const [selectedShiftForInvite, setSelectedShiftForInvite] = useState<Shift | null>(null);
  const [isInviteConfirmationOpen, setIsInviteConfirmationOpen] = useState(false);

  const professional = professionals.find((p) => p.id === id) || professionals[0];

  if (!professional) {
    return (
      <EmptyState
        icon={<Building2 className="w-6 h-6" />}
        title="Clinician Not Found"
        description="The requested healthcare professional profile could not be located."
        actionLabel="Back to Professionals"
        onAction={() => navigate('/hospital/professionals')}
      />
    );
  }

  const isFavorite = favoriteProfessionalIds.includes(professional.id);

  const handleToggleFavorite = () => {
    const isNowFav = toggleFavoriteProfessional(professional.id);
    showToast(
      isNowFav ? 'Saved to Favorites' : 'Removed from Favorites',
      `${professional.name} ${isNowFav ? 'added to' : 'removed from'} your hospital favorite list.`,
      'info'
    );
  };

  const openHospitalShifts = shifts.filter(
    (s) => s.status === 'Open' || s.status === 'Urgent' || s.status === 'Matching'
  );

  const handlePickShiftToInvite = (shift: Shift) => {
    setIsSelectShiftModalOpen(false);
    setSelectedShiftForInvite(shift);
    setIsInviteConfirmationOpen(true);
  };

  const handleConfirmInvite = (professionalId: string, customNote?: string) => {
    if (!selectedShiftForInvite) return;
    inviteProfessionalToShift(selectedShiftForInvite.id, professionalId, customNote);
    showToast(
      'Invitation Sent (Simulated)',
      `Dispatched shift offer to ${professional.name} for ${selectedShiftForInvite.specialty}. Alert logged.`,
      'success'
    );
  };

  const handleMessage = () => {
    showToast(
      'Direct Channel (Demo)',
      `Simulated message channel opened with ${professional.name}. Prototype messaging only.`,
      'info'
    );
  };

  const scrollToAvailability = () => {
    const el = document.getElementById('availability-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <PageHeader
        title={professional.name}
        description={`${professional.title} · ${professional.specialty} (${professional.subSpecialty || professional.profession})`}
        breadcrumbs={[
          { label: role === 'hospital' ? 'Hospital' : 'Directory', href: role === 'hospital' ? '/hospital/dashboard' : '/professional/dashboard' },
          { label: 'Professionals', href: '/hospital/professionals' },
          { label: professional.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite
                  ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMessage}
              icon={<MessageSquare className="w-4 h-4" />}
            >
              Message
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSelectShiftModalOpen(true)}
              icon={<Send className="w-4 h-4" />}
            >
              Invite to Shift
            </Button>
          </div>
        }
      />

      {/* Top Profile Summary Card */}
      <Card padding="lg" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <Avatar
              initials={professional.avatarInitials}
              name={professional.name}
              gradient={professional.avatarColor}
              size="xl"
              status={professional.currentStatus}
            />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {professional.title}
                </h1>
                {professional.verifiedCredentials && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Demo Verified</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {professional.specialty} · <span className="text-slate-500 dark:text-slate-400 font-normal">{professional.subSpecialty}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{professional.city}, UK</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{professional.hospitalAffiliation}</span>
                </span>
                <span>·</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                  {professional.gmcOrNmcNumber} (Sample)
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 block leading-tight">Indicative Rate</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              £{professional.hourlyRate}/hr
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium block mt-1">
              {professional.currentStatus} for Direct Booking
            </span>
          </div>
        </div>

        {/* 4 Track Record Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5">Experience</span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {professional.experienceYears} Years
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Post-qualification</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5">Completed Shifts</span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {professional.completedShiftsCount} Shifts
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 text-[10px] block">100% attendance</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5">Clinical Rating</span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              ★ {professional.rating} / 5.0
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Sample Trust Reviews</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5">Clinical References</span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {professional.clinicalReferencesCount || 3} Verified
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Simulated Sign-off</span>
          </div>
        </div>
      </Card>

      {/* Main Grid: Details (8 cols) + Sidebar/Activity (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Professional Summary */}
          <Card padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {professional.bio}
            </p>
          </Card>

          {/* Qualifications & Languages */}
          <Card padding="md" className="space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Qualifications & Accreditations (Sample Data)
              </h2>
              <div className="space-y-1.5">
                {professional.qualifications?.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Award className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{q}</span>
                    <span className="ml-auto text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      Sample Credential
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Languages Spoken
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {professional.languages?.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Availability Visualization */}
          <Card id="availability-section" padding="md" className="space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Weekly Availability Schedule</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Standard recurring weekly rota availability and hospital commitment blocks (Demo Rota).
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={() => setIsSelectShiftModalOpen(true)}>
                Book Clinician
              </Button>
            </div>

            {/* Week visualization list */}
            <div className="space-y-3">
              {daysOfWeek.map((day) => {
                const daySlots = professional.weeklySchedule?.[day] || [
                  { id: `${day}-1`, startTime: '09:00', endTime: '17:00', status: 'Available', location: 'Open for Locum' },
                  { id: `${day}-2`, startTime: '17:00', endTime: '23:00', status: 'Available', location: 'Twilight Cover' },
                ];

                return (
                  <div key={day} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block mb-2">{day}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            slot.status === 'Working'
                              ? 'bg-blue-50/70 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/60 dark:text-blue-300'
                              : slot.status === 'Available'
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-300'
                              : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'
                          }`}
                        >
                          <span className="font-mono font-bold text-[11px]">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className="text-[11px] truncate mx-2">{slot.location}</span>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              slot.status === 'Working'
                                ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : slot.status === 'Available'
                                ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {slot.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Verification & Timeline Activity (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Verification Status */}
          <Card padding="md" className="space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Verification Status (Prototype Data)
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-lg text-blue-900 dark:text-blue-300">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <p className="font-semibold">{professional.gmcOrNmcNumber}</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400">Sample Registry Status (Demo Verified)</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-lg text-blue-900 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <p className="font-semibold">Simulated DBS Clearance</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400">Prototype Sample Checked</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-lg text-blue-900 dark:text-blue-300">
                <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <p className="font-semibold">Right to Work Status</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400">Simulated Verification</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline of Recent Activity */}
          <Card padding="md" className="space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Clinical Activity (Simulated)
            </h2>

            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 ml-2 space-y-4 text-xs">
              {professional.recentActivity?.map((act) => (
                <div key={act.id} className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-400 ring-4 ring-white dark:ring-slate-900" />
                  <p className="font-semibold text-slate-900 dark:text-white">{act.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">{act.description}</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card padding="md" className="space-y-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setIsSelectShiftModalOpen(true)}
              icon={<Send className="w-4 h-4" />}
            >
              Invite to Shift
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={handleMessage}
              icon={<MessageSquare className="w-4 h-4" />}
            >
              Send Message
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={scrollToAvailability}
            >
              View Detailed Availability ↓
            </Button>
          </Card>
        </div>
      </div>

      {/* Select Shift Modal */}
      <Modal
        isOpen={isSelectShiftModalOpen}
        onClose={() => setIsSelectShiftModalOpen(false)}
        title={`Invite ${professional.name}`}
        description={`Select an open shift requirement to send to this clinician`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Select one of your hospital's open shifts to invite{' '}
            <strong className="text-slate-900 dark:text-white">{professional.name}</strong>:
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {openHospitalShifts.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg">
                No open shifts currently awaiting allocation. Post a new shift requirement first.
              </div>
            ) : (
              openHospitalShifts.map((shift) => {
                const isAlreadyInvited =
                  shift.invitedProfessionalIds?.includes(professional.id) ||
                  shift.matchedCandidateId === professional.id;

                return (
                  <div
                    key={shift.id}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between text-xs hover:border-teal-400 transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {shift.specialty} · {shift.hospitalName}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {shift.dateLabel} · {shift.startTime} - {shift.endTime} · £{shift.hourlyRate}/hr
                      </p>
                    </div>
                    {isAlreadyInvited ? (
                      <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800 shrink-0">
                        Already Invited
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePickShiftToInvite(shift)}
                      >
                        Select Shift
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSelectShiftModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Full Invitation Flow Confirmation Modal */}
      <InvitationModal
        isOpen={isInviteConfirmationOpen}
        onClose={() => setIsInviteConfirmationOpen(false)}
        professional={professional}
        shift={selectedShiftForInvite}
        onConfirmInvite={handleConfirmInvite}
      />
    </div>
  );
};
