import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp, deduplicateShifts } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { calculateMatchScore } from '../../utils/matching';
import { Shift, Profession, Specialty, UKCity } from '../../types';
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
  Bookmark,
  Award,
} from 'lucide-react';

export const ProfessionalShiftsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    shifts,
    professionalUser,
    savedShiftIds,
    toggleSaveShift,
  } = useApp();
  const cleanShifts = deduplicateShifts(shifts);
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'booked' | 'saved'>(
    searchParams.get('view') === 'booked' ? 'booked' : 'all'
  );

  // Filters: Specialty, City, Date, Profession, Minimum hourly rate, Status
  const [selectedProfession, setSelectedProfession] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [minRate, setMinRate] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchParams.get('view') === 'booked') {
      setActiveTab('booked');
    }
  }, [searchParams]);

  const handleToggleSave = (shift: Shift) => {
    const isNowSaved = toggleSaveShift(shift.id);
    showToast(
      isNowSaved ? 'Shift Saved' : 'Shift Removed from Saved',
      `${shift.specialty} shift at ${shift.hospitalName} has been ${isNowSaved ? 'added to' : 'removed from'} your saved shifts.`,
      'info'
    );
  };

  // Tab filtering
  const getShiftsForTab = () => {
    if (activeTab === 'booked') {
      return cleanShifts.filter(
        (s) =>
          s.status === 'Filled' &&
          (s.filledByProfessionalId === professionalUser.id ||
            s.matchedCandidateId === professionalUser.id)
      );
    }
    if (activeTab === 'saved') {
      return cleanShifts.filter((s) => savedShiftIds.includes(s.id));
    }
    if (activeTab === 'recommended') {
      return cleanShifts.filter(
        (s) =>
          s.status !== 'Filled' &&
          s.status !== 'Cancelled' &&
          (s.specialty === professionalUser.specialty || s.city === professionalUser.city)
      );
    }
    return cleanShifts.filter((s) => s.status !== 'Cancelled');
  };

  const currentTabShifts = getShiftsForTab();

  const filteredShifts = currentTabShifts.filter((shift) => {
    if (selectedProfession !== 'All' && shift.profession !== selectedProfession) return false;
    if (selectedSpecialty !== 'All' && shift.specialty !== selectedSpecialty) return false;
    if (selectedCity !== 'All' && shift.city !== selectedCity) return false;
    if (selectedDate !== 'All' && !(shift.dateLabel || '').toLowerCase().includes(selectedDate.toLowerCase())) return false;
    if (selectedStatus !== 'All' && shift.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    if (shift.hourlyRate < minRate) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        shift.hospitalName.toLowerCase().includes(q) ||
        shift.specialty.toLowerCase().includes(q) ||
        shift.department.toLowerCase().includes(q) ||
        shift.city.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          activeTab === 'booked'
            ? 'My Confirmed Rota Shifts'
            : activeTab === 'saved'
            ? 'Saved Shift Bookmarks'
            : 'Find Healthcare Shifts'
        }
        description="Browse accredited clinical shift vacancies matching your schedule, specialty, and preferred rates."
        breadcrumbs={[
          { label: 'Clinician', href: '/professional/dashboard' },
          { label: 'Find Shifts' },
        ]}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        <button
          onClick={() => {
            setActiveTab('all');
            setSearchParams({});
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Shifts ({shifts.filter((s) => s.status !== 'Cancelled').length})
        </button>

        <button
          onClick={() => {
            setActiveTab('recommended');
            setSearchParams({});
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'recommended'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recommended For You</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('booked');
            setSearchParams({ view: 'booked' });
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'booked'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>My Booked Shifts</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('saved');
            setSearchParams({});
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved ({savedShiftIds.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 text-xs">
        {/* Top search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospital, ward, specialty, city, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {/* Filters grid (6 parameters) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {/* Profession */}
          <select
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="All">All Professions</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Pharmacist">Pharmacist</option>
          </select>

          {/* Specialty */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="All">All Specialties</option>
            <option value="Emergency Medicine">Emergency Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
            <option value="Gastroenterology">Gastroenterology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="General Medicine">General Medicine</option>
          </select>

          {/* City */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
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

          {/* Date */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="16 Oct">16 Oct</option>
            <option value="17 Oct">17 Oct</option>
          </select>

          {/* Shift status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Urgent">Urgent</option>
            <option value="Invited">Invited</option>
            <option value="Filled">Filled</option>
          </select>

          {/* Minimum hourly rate */}
          <select
            value={minRate}
            onChange={(e) => setMinRate(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
          >
            <option value={0}>Any Rate</option>
            <option value={50}>Min £50/hr</option>
            <option value={75}>Min £75/hr</option>
            <option value={85}>Min £85/hr</option>
            <option value={95}>Min £95/hr</option>
          </select>
        </div>
      </div>

      {/* Shifts Grid */}
      {filteredShifts.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-6 h-6" />}
          title={
            activeTab === 'booked'
              ? 'No Confirmed Shifts'
              : activeTab === 'saved'
              ? 'No Saved Shifts'
              : 'No Shifts Found'
          }
          description="Try clearing your filters to see more clinical shift opportunities across UK trusts."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedProfession('All');
            setSelectedSpecialty('All');
            setSelectedCity('All');
            setSelectedDate('All');
            setSelectedStatus('All');
            setMinRate(0);
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShifts.map((shift) => {
            const match = calculateMatchScore(shift, professionalUser);
            const isBooked = shift.status === 'Filled';
            const isSaved = savedShiftIds.includes(shift.id);

            return (
              <Card
                key={shift.id}
                hoverEffect
                padding="none"
                className="overflow-hidden flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <div className="p-5 space-y-3">
                  {/* Top: Specialty & Match Score */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                          {shift.specialty}
                        </h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {shift.profession}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{shift.department}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded inline-block">
                        {match.score}% Match
                      </span>
                    </div>
                  </div>

                  {/* Hospital & Location */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-white truncate">
                        {shift.hospitalName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{shift.city} ({shift.locationDetails})</span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                        <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>{shift.dateLabel}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{shift.startTime} - {shift.endTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Requirements row */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/70 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-medium">
                      <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Requirements: {shift.requiredExperienceYears}+ yrs</span>
                    </span>
                    <StatusBadge status={shift.priority} />
                  </div>
                </div>

                {/* Footer: Rate + CTA */}
                <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">Pay Rate</span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        £{shift.hourlyRate}/hr
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        (£{shift.totalPay})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSave(shift)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                          : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:text-slate-200'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Save Shift'}
                      aria-label={isSaved ? 'Remove Bookmark' : 'Save Shift'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-600' : ''}`} />
                    </button>

                    <Button
                      variant={isBooked ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => navigate(`/shifts/${shift.id}`)}
                    >
                      {isBooked ? 'View Booking' : 'View Shift'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
