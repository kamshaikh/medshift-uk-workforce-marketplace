import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, deduplicateShifts } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { rankProfessionalsForShift } from '../../utils/matching';
import { Shift, ShiftStatus } from '../../types';
import {
  Plus,
  Search,
  Clock,
  Building2,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const HospitalShiftsPage: React.FC = () => {
  const navigate = useNavigate();
  const { shifts, professionals } = useApp();

  const cleanShifts = deduplicateShifts(shifts);

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statusTabs = [
    { id: 'All', label: 'All Shifts' },
    { id: 'Open', label: 'Open' },
    { id: 'Matching', label: 'Matching' },
    { id: 'Invited', label: 'Invited' },
    { id: 'Filled', label: 'Filled' },
    { id: 'Cancelled', label: 'Cancelled' },
  ];

  const filteredShifts = cleanShifts.filter((shift) => {
    const matchesStatus =
      selectedStatus === 'All'
        ? true
        : selectedStatus === 'Open'
        ? shift.status === 'Open' || shift.status === 'Urgent'
        : shift.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesSpecialty =
      selectedSpecialty === 'All' || shift.specialty === selectedSpecialty;

    const matchesSearch =
      shift.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSpecialty && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Shift Rota Management"
        description="Monitor open vacancies, live algorithmic candidate matches, sent invitations, and confirmed cover."
        breadcrumbs={[
          { label: 'Hospital', href: '/hospital/dashboard' },
          { label: 'Shifts' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/hospital/post-shift')}
            icon={<Plus className="w-4 h-4" />}
          >
            Post a Shift
          </Button>
        }
      />

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {statusTabs.map((tab) => {
          const count =
            tab.id === 'All'
              ? cleanShifts.length
              : tab.id === 'Open'
              ? cleanShifts.filter((s) => s.status === 'Open' || s.status === 'Urgent').length
              : cleanShifts.filter((s) => s.status.toLowerCase() === tab.id.toLowerCase()).length;

          const isSelected = selectedStatus === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-xs'
                  : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-slate-800 text-slate-200 dark:bg-teal-700' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Specialty Filter */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shift specialty, ward, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
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
      </div>

      {/* Shift Cards Grid */}
      {filteredShifts.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-6 h-6" />}
          title="No Shifts in this View"
          description="There are currently no shift requirements matching your status or search filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedStatus('All');
            setSelectedSpecialty('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShifts.map((shift) => {
            const ranked = rankProfessionalsForShift(shift, professionals);
            const highMatchesCount = ranked.filter((m) => m.score >= 75).length;

            return (
              <Card
                key={shift.id}
                hoverEffect
                padding="none"
                onClick={() => navigate(`/hospital/matching-results?shiftId=${shift.id}`)}
                className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer flex flex-col justify-between group"
              >
                <div className="p-5 space-y-3">
                  {/* Status & Urgency */}
                  <div className="flex items-start justify-between gap-2">
                    <StatusBadge status={shift.status} />
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                      £{shift.hourlyRate}/hr
                    </span>
                  </div>

                  {/* Shift Title & Required Specialty */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {shift.specialty} {shift.profession}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{shift.department}</p>
                  </div>

                  {/* Location & Time */}
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{shift.hospitalName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{shift.city}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 font-medium text-slate-900 dark:text-white">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{shift.dateLabel}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-slate-600 dark:text-slate-400">
                        {shift.startTime} - {shift.endTime} ({shift.durationHours}h)
                      </span>
                    </div>
                  </div>

                  {/* Number of Matches */}
                  <div className="p-2.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 text-xs flex items-center justify-between text-teal-900 dark:text-teal-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{highMatchesCount} High Matches</span>
                    </span>
                    <span className="text-[11px] text-teal-700 dark:text-teal-400">
                      {ranked.length} evaluated
                    </span>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Total: £{shift.totalPay}</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    <span>Manage Matches</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
