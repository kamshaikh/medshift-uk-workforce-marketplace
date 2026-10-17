import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { ProfessionalCard } from '../../components/professionals/ProfessionalCard';
import { ProfessionalDetailsModal } from '../../components/professionals/ProfessionalDetailsModal';
import { InvitationModal } from '../../components/hospital/InvitationModal';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { HealthcareProfessional, Shift } from '../../types';
import { Users, Search, Heart, Filter, ShieldCheck } from 'lucide-react';

export const HospitalProfessionalsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    professionals,
    shifts,
    inviteProfessionalToShift,
    favoriteProfessionalIds,
  } = useApp();
  const { showToast } = useToast();

  const [selectedProfession, setSelectedProfession] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [selectedProfessional, setSelectedProfessional] = useState<HealthcareProfessional | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSelectShiftModalOpen, setIsSelectShiftModalOpen] = useState(false);
  const [inviteTargetProf, setInviteTargetProf] = useState<HealthcareProfessional | null>(null);
  const [selectedShiftForInvite, setSelectedShiftForInvite] = useState<Shift | null>(null);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);

  const filteredProfessionals = professionals.filter((prof) => {
    if (selectedProfession !== 'All' && prof.profession !== selectedProfession) return false;
    if (selectedSpecialty !== 'All' && prof.specialty !== selectedSpecialty) return false;
    if (selectedCity !== 'All' && prof.city !== selectedCity) return false;
    if (prof.experienceYears < minExperience) return false;
    if (selectedStatus !== 'All' && prof.currentStatus !== selectedStatus) return false;
    if (favoritesOnly && !favoriteProfessionalIds.includes(prof.id)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        prof.name.toLowerCase().includes(q) ||
        prof.specialty.toLowerCase().includes(q) ||
        prof.city.toLowerCase().includes(q) ||
        (prof.subSpecialty && prof.subSpecialty.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    return true;
  });

  const openShifts = shifts.filter((s) => s.status === 'Open' || s.status === 'Urgent' || s.status === 'Matching');

  const handleOpenInviteFlow = (prof: HealthcareProfessional) => {
    setInviteTargetProf(prof);
    if (openShifts.length > 0) {
      setIsSelectShiftModalOpen(true);
    } else {
      showToast(
        'No Open Shifts',
        'Please post a new shift requirement first before dispatching invitations.',
        'info'
      );
    }
  };

  const handlePickShift = (shift: Shift) => {
    setSelectedShiftForInvite(shift);
    setIsSelectShiftModalOpen(false);
    setIsInvitationModalOpen(true);
  };

  const handleConfirmInvite = (professionalId: string, customNote?: string) => {
    if (!selectedShiftForInvite || !inviteTargetProf) return;
    inviteProfessionalToShift(selectedShiftForInvite.id, professionalId, customNote);
    showToast(
      'Invitation Sent (Simulated)',
      `Dispatched shift offer to ${inviteTargetProf.name} for ${selectedShiftForInvite.specialty}. Notification created.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Healthcare Professionals"
        description="Search accredited clinicians by specialty, city, clinical experience, and real-time rota availability (Demo Registry)"
        breadcrumbs={[
          { label: 'Hospital' },
          { label: 'Professionals' },
        ]}
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            {professionals.length} Clinicians in Registry
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 text-xs">
        {/* Search bar & Favorites toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clinician by name, specialty, or subspecialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <button
            type="button"
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={`px-3 py-2 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-colors shrink-0 ${
              favoritesOnly
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-semibold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favorites only ({favoriteProfessionalIds.length})</span>
          </button>
        </div>

        {/* 5 Distinct Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          {/* Profession */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Profession
            </label>
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All Professions</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              City / Region
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All Cities</option>
              <option value="London">London</option>
              <option value="Manchester">Manchester</option>
              <option value="Birmingham">Birmingham</option>
              <option value="Leeds">Leeds</option>
              <option value="Bristol">Bristol</option>
              <option value="Liverpool">Liverpool</option>
              <option value="Edinburgh">Edinburgh</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Min Experience
            </label>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value={0}>Any Experience</option>
              <option value={3}>3+ Years</option>
              <option value={5}>5+ Years</option>
              <option value={8}>8+ Years</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Availability
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Now</option>
              <option value="On Shift">On Shift</option>
              <option value="Resting">Resting (Off Duty)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Professionals Grid */}
      {filteredProfessionals.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No Professionals Found"
          description="We couldn't find any healthcare professionals matching your active filter criteria."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedProfession('All');
            setSelectedSpecialty('All');
            setSelectedCity('All');
            setMinExperience(0);
            setSelectedStatus('All');
            setFavoritesOnly(false);
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfessionals.map((prof) => (
            <ProfessionalCard
              key={prof.id}
              professional={prof}
              onViewProfile={(p) => {
                navigate(`/professionals/${p.id}`);
              }}
              onInviteToShift={handleOpenInviteFlow}
            />
          ))}
        </div>
      )}

      {/* Select Shift Modal */}
      <Modal
        isOpen={isSelectShiftModalOpen}
        onClose={() => setIsSelectShiftModalOpen(false)}
        title={`Invite ${inviteTargetProf?.name}`}
        description="Select which open shift requirement to offer this clinician"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Choose an open requirement for{' '}
            <strong className="text-slate-900 dark:text-white">{inviteTargetProf?.name}</strong>:
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {openShifts.map((shift) => {
              const isAlreadyInvited =
                inviteTargetProf &&
                (shift.invitedProfessionalIds?.includes(inviteTargetProf.id) ||
                  shift.matchedCandidateId === inviteTargetProf.id);

              return (
                <div
                  key={shift.id}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between text-xs hover:border-teal-400 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {shift.specialty} ({shift.dateLabel})
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {shift.hospitalName} · {shift.startTime} - {shift.endTime} · £{shift.hourlyRate}/hr
                    </p>
                  </div>
                  {isAlreadyInvited ? (
                    <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800">
                      Already Invited
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handlePickShift(shift)}
                    >
                      Select Shift
                    </Button>
                  )}
                </div>
              );
            })}
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

      {/* Invitation Confirmation Modal */}
      <InvitationModal
        isOpen={isInvitationModalOpen}
        onClose={() => setIsInvitationModalOpen(false)}
        professional={inviteTargetProf}
        shift={selectedShiftForInvite}
        onConfirmInvite={handleConfirmInvite}
      />
    </div>
  );
};
