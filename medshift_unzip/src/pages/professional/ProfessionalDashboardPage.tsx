import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, deduplicateShifts } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ShiftCard } from '../../components/shifts/ShiftCard';
import { ShiftDetailsModal } from '../../components/shifts/ShiftDetailsModal';
import { Shift } from '../../types';
import {
  CalendarCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  MapPin,
  Building2,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  CreditCard,
  User,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const ProfessionalDashboardPage: React.FC = () => {
  const {
    professionalUser,
    shifts,
    scheduleSlots,
    toggleScheduleAvailability,
    acceptShiftByProfessional,
    professionals,
  } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const cleanShifts = deduplicateShifts(shifts);

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Shifts matched or relevant to Dr. Sarah Mitchell (Dermatology, London)
  const matchedOpportunities = cleanShifts.filter(
    (s) =>
      s.status !== 'Filled' &&
      (s.specialty === professionalUser.specialty ||
        s.matchedCandidateId === professionalUser.id ||
        s.city === professionalUser.city)
  );

  const upcomingBookedShifts = cleanShifts.filter(
    (s) =>
      s.status === 'Filled' &&
      (s.filledByProfessionalId === professionalUser.id ||
        s.matchedCandidateId === professionalUser.id)
  );

  const completedCount = professionalUser.completedShiftsCount;
  const estimatedMonthEarnings = 4820; // £ realistic figure

  // Direct invitations for Dr. Sarah Mitchell
  const directInvitations = cleanShifts.filter(
    (s) =>
      s.status !== 'Filled' &&
      (s.invitedProfessionalIds?.includes(professionalUser.id) ||
        (s.status === 'Invited' && s.specialty === professionalUser.specialty))
  );

  return (
    <div className="space-y-6">
      {/* Clinician Welcome Banner */}
      <PageHeader
        title={`Welcome back, ${professionalUser.name}`}
        description={`${professionalUser.title} · ${professionalUser.specialty} (${professionalUser.subSpecialty}) · ${professionalUser.city}`}
        breadcrumbs={[
          { label: 'Clinician' },
          { label: 'Dashboard' },
        ]}
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Demo Verified (Sample GMC)</span>
          </span>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/professional/availability')}
            icon={<CalendarCheck className="w-4 h-4" />}
          >
            Manage Availability
          </Button>
        }
      />

      {/* Direct Shift Invitations Banner */}
      {directInvitations.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-5 shadow-md border border-purple-700/60">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Direct Shift Invitation Received
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-purple-800 text-purple-200 px-2 py-0.5 rounded border border-purple-600">
              {directInvitations.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {directInvitations.slice(0, 2).map((invitation) => (
              <div
                key={invitation.id}
                className="p-3.5 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">
                      {invitation.specialty} {invitation.profession}
                    </span>
                    <span className="text-purple-200 font-semibold">
                      · {invitation.hospitalName} ({invitation.city})
                    </span>
                  </div>
                  <p className="text-purple-200 text-[11px] mt-0.5">
                    {invitation.dateLabel} · {invitation.startTime} - {invitation.endTime} ({invitation.durationHours} hrs) · £{invitation.hourlyRate}/hr (£{invitation.totalPay} total)
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={() => navigate(`/shifts/${invitation.id}`)}
                  >
                    View Shift Details
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      acceptShiftByProfessional(invitation.id);
                      showToast(
                        'Shift Accepted & Confirmed',
                        `You confirmed ${invitation.specialty} at ${invitation.hospitalName}. Added to your clinical rota.`,
                        'success'
                      );
                    }}
                  >
                    Accept Shift
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Matched Opportunities"
          value={matchedOpportunities.length}
          subtitle="Matching your specialty & radius"
          icon={<Sparkles className="w-5 h-5" />}
          iconBgColor="bg-blue-50 text-blue-700"
          trend={{ value: '3 new today', isPositive: true }}
          onClick={() => navigate('/professional/shifts')}
        />

        <StatCard
          title="Upcoming Shifts"
          value={upcomingBookedShifts.length > 0 ? upcomingBookedShifts.length : 1}
          subtitle="Confirmed clinical rota dates"
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
          trend={{ value: 'Next: St Mary’s' }}
        />

        <StatCard
          title="Completed Shifts"
          value={completedCount}
          subtitle="All-time verified hospital shifts"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-purple-50 text-purple-700"
          trend={{ value: '4.95 / 5.0 Rating', isPositive: true }}
        />

        <StatCard
          title="Estimated Earnings"
          value={`£${estimatedMonthEarnings.toLocaleString()}`}
          subtitle="Current month locum & bank pay"
          icon={<CreditCard className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-700"
          trend={{ value: '+14% vs last month', isPositive: true }}
        />
      </div>

      {/* Grid: Left Column: Today's Schedule & Current Availability | Right Column: Live Status & Profile Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Today's Schedule & Clinical Availability</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time timeline. Hospitals match locum opportunities based on your open slots.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                Today
              </span>
            </div>

            {/* Schedule Slot Cards */}
            <div className="space-y-3">
              {scheduleSlots.map((slot) => {
                const isWorking = slot.status === 'Working';
                const isAvailable = slot.status === 'Available';
                const isUnavailable = slot.status === 'Unavailable';

                return (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      isWorking
                        ? 'bg-blue-50/50 border-blue-200'
                        : isAvailable
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-24 shrink-0 font-mono font-bold text-slate-900 tabular-nums text-sm">
                        {slot.startTime} - {slot.endTime}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {slot.location}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {isWorking
                            ? 'Scheduled Day Clinic (Imperial Trust)'
                            : isAvailable
                            ? 'Open for rapid hospital match or on-call cover'
                            : 'Mandatory EWTD rest interval'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span
                        className={`font-semibold px-2.5 py-1 rounded-md text-xs uppercase tracking-wider ${
                          isWorking
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {slot.status}
                      </span>

                      {/* Interactive toggle for Available slot */}
                      {!isWorking && (
                        <button
                          onClick={() => toggleScheduleAvailability(slot.id)}
                          className="text-xs font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
                          title="Click to toggle availability"
                        >
                          {isAvailable ? 'Set Off Duty' : 'Set Available'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Next scheduled change: 17:00</span>
              <button
                onClick={() => navigate('/professional/availability')}
                className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Edit 7-day pattern</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Upcoming Confirmed Shift (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card padding="md" className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Confirmed Upcoming Shift
            </h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">St Mary's Hospital</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  Confirmed
                </span>
              </div>

              <div className="space-y-1 text-slate-600">
                <p>Cambridge Wing, Level 2</p>
                <p className="font-semibold text-slate-800">Dermatology Skin Clinic</p>
                <div className="flex items-center gap-1.5 text-slate-500 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono">Tomorrow · 13:00 - 19:00</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-700">
                <span>Remuneration:</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">
                  £528 (6 hrs @ £88/hr)
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-slate-800">Induction & Contacts:</p>
              <p>Clinical Lead: Dr. Alistair Vance (Paddington)</p>
              <p>Digital timesheet will automatically unlock at 13:00.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Shifts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Recommended Shifts For You
            </h2>
            <p className="text-xs text-slate-500">
              Personalized based on your specialty ({professionalUser.specialty}) and London radius
            </p>
          </div>

          <button
            onClick={() => navigate('/professional/shifts')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Shifts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchedOpportunities.slice(0, 3).map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              userRole="professional"
              onViewDetails={(s) => {
                navigate(`/shifts/${s.id}`);
              }}
              onAcceptShift={(shiftId) => {
                acceptShiftByProfessional(shiftId);
              }}
            />
          ))}
        </div>
      </div>

      {/* Shift Details Modal */}
      <ShiftDetailsModal
        shift={selectedShift}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        userRole="professional"
        professionals={professionals}
        onAcceptShift={(shiftId) => {
          acceptShiftByProfessional(shiftId);
          setIsDetailsOpen(false);
        }}
      />
    </div>
  );
};
