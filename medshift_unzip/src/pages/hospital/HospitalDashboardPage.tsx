import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, deduplicateShifts } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ShiftDetailsModal } from '../../components/shifts/ShiftDetailsModal';
import { PostShiftModal } from '../../components/shifts/PostShiftModal';
import { Shift, Specialty } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Plus,
  Search,
  Calendar,
  Eye,
  UserCheck,
  TrendingUp,
  BarChart3,
  Activity,
  Sparkles,
  Info,
} from 'lucide-react';

export const HospitalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    shifts,
    professionals,
    hospitalUser,
    matchShift,
  } = useApp();

  const cleanShifts = deduplicateShifts(shifts);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPostShiftOpen, setIsPostShiftOpen] = useState(false);

  // Compute live metrics from current state
  const totalShiftsCount = cleanShifts.length || 1;
  const openShiftsCount = cleanShifts.filter((s) => s.status === 'Open' || s.status === 'Urgent').length;
  const filledShiftsCount = cleanShifts.filter((s) => s.status === 'Filled').length;
  const invitedShiftsCount = cleanShifts.filter((s) => s.status === 'Invited' || s.status === 'Matched').length;
  const urgentCount = cleanShifts.filter((s) => s.priority === 'Urgent' || s.status === 'Urgent').length;
  const availableProfessionalsCount = professionals.filter((p) => p.currentStatus === 'Available').length;

  const fillRatePercentage = Math.round((filledShiftsCount / totalShiftsCount) * 100);

  // Aggregation of shifts by specialty
  const specialtyBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    cleanShifts.forEach((s) => {
      counts[s.specialty] = (counts[s.specialty] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([specialty, count]) => ({
        specialty,
        count,
        percentage: Math.round((count / totalShiftsCount) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [cleanShifts, totalShiftsCount]);

  // Filtered shifts for table
  const filteredShifts = cleanShifts.filter((shift) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'urgent'
        ? shift.status === 'Urgent' || shift.priority === 'Urgent'
        : shift.status.toLowerCase() === filterStatus.toLowerCase();

    const matchesSearch =
      shift.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenDetails = (shift: Shift) => {
    setSelectedShift(shift);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Hospital Rota & Analytics"
        description={`Clinical workforce allocation and staffing performance for ${hospitalUser.name} (${hospitalUser.trustName})`}
        breadcrumbs={[
          { label: 'Hospital' },
          { label: 'Dashboard & Analytics' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/hospital/post-shift')}
              icon={<Plus className="w-4 h-4" />}
            >
              Post a Shift
            </Button>
          </div>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Shifts"
          value={openShiftsCount}
          subtitle="Awaiting clinician allocation"
          icon={<Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
          iconBgColor="bg-teal-50 dark:bg-teal-950/40 text-teal-700"
          trend={{ value: `${openShiftsCount} active rota slots`, isPositive: true }}
        />

        <StatCard
          title="Filled Shifts"
          value={filledShiftsCount}
          subtitle="Confirmed clinical coverage"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700"
          trend={{ value: `${fillRatePercentage}% fill rate`, isPositive: true }}
        />

        <StatCard
          title="Urgent Requirements"
          value={urgentCount}
          subtitle="Immediate clinical on-call gaps"
          icon={<AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          iconBgColor="bg-rose-50 dark:bg-rose-950/40 text-rose-700"
          trend={{ value: 'Priority dispatch' }}
        />

        <StatCard
          title="Available Professionals"
          value={availableProfessionalsCount}
          subtitle="Ready in regional catchment"
          icon={<Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700"
          trend={{ value: `${professionals.length} in registry`, isPositive: true }}
        />
      </div>

      {/* Day 3 Analytics Section (Objective 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Staffing Analytics & Rota Metrics
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            State-derived metrics · Prototype simulation
          </span>
        </div>

        {/* 4 Performance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Shift Fill Rate
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
                {fillRatePercentage}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({filledShiftsCount}/{shifts.length})
              </span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${fillRatePercentage}%` }}
              />
            </div>
          </Card>

          <Card padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Open Requirements
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {openShiftsCount}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                {urgentCount} urgent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Active vacancies awaiting doctor / nurse confirmation
            </p>
          </Card>

          <Card padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Avg Match Compatibility
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                88.4%
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                High accuracy
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Based on 100-pt multi-factor candidate scoring engine
            </p>
          </Card>

          <Card padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Avg Response Time
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                42 mins
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                (Sample data)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Clinician invite-to-acceptance turnaround benchmark
            </p>
          </Card>
        </div>

        {/* Charts Row: Specialty Demand & Rota Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Shift Demand by Specialty (8 cols) */}
          <Card padding="md" className="lg:col-span-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Shift Allocation Demand by Specialty
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aggregated distribution across published trust rotas
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {shifts.length} Total Shifts
              </span>
            </div>

            {/* Custom SVG / Clean CSS Bar Chart */}
            <div className="space-y-3 pt-1">
              {specialtyBreakdown.slice(0, 6).map((item) => (
                <div key={item.specialty} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.specialty}
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {item.count} shift{item.count === 1 ? '' : 's'} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 dark:bg-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Rota Status Distribution (4 cols) */}
          <Card padding="md" className="lg:col-span-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rota Status Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fulfillment pipeline in active state
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-900 dark:text-emerald-300">Filled & Confirmed</span>
                <span className="font-bold font-mono text-emerald-800 dark:text-emerald-200">{filledShiftsCount} shifts</span>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs">
                <span className="font-medium text-blue-900 dark:text-blue-300">Invited / Matched</span>
                <span className="font-bold font-mono text-blue-800 dark:text-blue-200">{invitedShiftsCount} shifts</span>
              </div>

              <div className="p-2.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 flex items-center justify-between text-xs">
                <span className="font-medium text-teal-900 dark:text-teal-300">Open Vacancies</span>
                <span className="font-bold font-mono text-teal-800 dark:text-teal-200">{openShiftsCount} shifts</span>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs">
                <span className="font-medium text-rose-900 dark:text-rose-300">Urgent Escalations</span>
                <span className="font-bold font-mono text-rose-800 dark:text-rose-200">{urgentCount} shifts</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center">
              Updates in real-time as shifts are posted, invited, and accepted
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Shift Requirements Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Shift Requirements Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current rota vacancies and candidate matching status
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search specialty, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 w-full sm:w-48"
              />
            </div>

            {/* Segmented Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {[
                { id: 'all', label: 'All' },
                { id: 'urgent', label: 'Urgent' },
                { id: 'open', label: 'Open' },
                { id: 'invited', label: 'Invited' },
                { id: 'filled', label: 'Filled' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 sm:px-6">Role & Specialty</th>
                <th className="py-3 px-4">Hospital & City</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No shifts found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredShifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Role & Specialty */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 dark:text-white">{shift.specialty}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{shift.profession}</span>
                        <span>·</span>
                        <span className="truncate max-w-[140px]">{shift.department}</span>
                      </div>
                    </td>

                    {/* Hospital & City */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">{shift.city}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[180px]">
                        {shift.hospitalName}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>{shift.dateLabel}</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 font-mono tabular-nums text-[11px]">
                        {shift.startTime} - {shift.endTime} ({shift.durationHours}h)
                      </div>
                    </td>

                    {/* Rate */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums">
                      <div className="font-bold text-slate-900 dark:text-white">£{shift.hourlyRate}/hr</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">£{shift.totalPay} total</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={shift.status} />
                      {shift.status === 'Invited' && shift.matchedCandidateName && (
                        <div className="text-[10px] text-teal-700 dark:text-teal-400 font-medium mt-0.5 truncate max-w-[120px]">
                          Invited: {shift.matchedCandidateName}
                        </div>
                      )}
                      {shift.status === 'Filled' && shift.filledByProfessionalName && (
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5 truncate max-w-[120px]">
                          {shift.filledByProfessionalName}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetails(shift)}
                          icon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Details
                        </Button>

                        {shift.status !== 'Filled' && (
                          <Button
                            variant={shift.status === 'Urgent' ? 'danger' : 'primary'}
                            size="sm"
                            onClick={() => navigate(`/hospital/matching-results?shiftId=${shift.id}`)}
                            icon={<UserCheck className="w-3.5 h-3.5" />}
                          >
                            {shift.status === 'Matched' || shift.status === 'Matching' || shift.status === 'Invited' ? 'Matches' : 'Match'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ShiftDetailsModal
        shift={selectedShift}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        userRole="hospital"
        professionals={professionals}
        onMatchCandidate={(shiftId, profId, profName) => {
          matchShift(shiftId, profId, profName);
          setIsDetailsOpen(false);
        }}
      />

      <PostShiftModal
        isOpen={isPostShiftOpen}
        onClose={() => setIsPostShiftOpen(false)}
      />
    </div>
  );
};
