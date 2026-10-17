import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { rankProfessionalsForShift } from '../../utils/matching';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { InvitationModal } from '../../components/hospital/InvitationModal';
import { HealthcareProfessional } from '../../types';
import {
  Sparkles,
  MapPin,
  Clock,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Send,
  User,
  ArrowLeft,
  Heart,
  Check,
  FastForward,
  RotateCcw,
} from 'lucide-react';

const MATCH_STAGES = [
  { id: 1, label: 'Checking clinical specialty match (30 pts)', short: 'Specialty check' },
  { id: 2, label: 'Evaluating location & regional trust catchment (20 pts)', short: 'Location check' },
  { id: 3, label: 'Checking clinician schedule & on-call availability (30 pts)', short: 'Availability check' },
  { id: 4, label: 'Evaluating clinical experience requirements (15 pts)', short: 'Experience check' },
  { id: 5, label: 'Verifying profession & ranking candidates (5 pts)', short: 'Candidate ranking' },
];

export const MatchingResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    shifts,
    professionals,
    inviteProfessionalToShift,
    favoriteProfessionalIds,
    toggleFavoriteProfessional,
  } = useApp();
  const { showToast } = useToast();

  const shiftId = searchParams.get('shiftId') || shifts[0]?.id;
  const currentShift = shifts.find((s) => s.id === shiftId) || shifts[0];

  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  // Cinematic matching state (~2s)
  const [isMatchingActive, setIsMatchingActive] = useState<boolean>(true);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);

  // Invitation Modal State
  const [selectedProfessionalForInvite, setSelectedProfessionalForInvite] =
    useState<HealthcareProfessional | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Compute matches using untouched Day 2 algorithm
  const rankedMatches = useMemo(() => {
    if (!currentShift) return [];
    return rankProfessionalsForShift(currentShift, professionals);
  }, [currentShift, professionals]);

  // Stage progression timer (~400ms per stage = ~2s total)
  useEffect(() => {
    if (!isMatchingActive) return;

    if (currentStageIdx < MATCH_STAGES.length) {
      const timer = setTimeout(() => {
        setCurrentStageIdx((prev) => prev + 1);
      }, 420);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        setIsMatchingActive(false);
      }, 350);
      return () => clearTimeout(finishTimer);
    }
  }, [isMatchingActive, currentStageIdx]);

  const handleSkipAnimation = () => {
    setIsMatchingActive(false);
    setCurrentStageIdx(MATCH_STAGES.length);
  };

  const handleReplayAnimation = () => {
    setCurrentStageIdx(0);
    setIsMatchingActive(true);
  };

  const filteredMatches = rankedMatches.filter((m) => {
    if (m.score < minScoreFilter) return false;
    if (favoritesOnly && !favoriteProfessionalIds.includes(m.professional.id)) return false;
    return true;
  });

  const handleOpenInvite = (prof: HealthcareProfessional) => {
    setSelectedProfessionalForInvite(prof);
    setIsInviteModalOpen(true);
  };

  const handleConfirmInvite = (professionalId: string, customNote?: string) => {
    if (!currentShift) return;
    const prof = professionals.find((p) => p.id === professionalId);
    inviteProfessionalToShift(currentShift.id, professionalId, customNote);
    showToast(
      'Invitation Sent (Simulated)',
      `Dispatched priority invitation to ${prof ? prof.name : 'clinician'} for ${currentShift.specialty} shift. Notification created.`,
      'success'
    );
  };

  const handleToggleFavorite = (prof: HealthcareProfessional) => {
    const isNowFav = toggleFavoriteProfessional(prof.id);
    showToast(
      isNowFav ? 'Added to Hospital Favorites' : 'Removed from Favorites',
      `${prof.name} has been ${isNowFav ? 'saved to' : 'removed from'} your preferred clinician list.`,
      'info'
    );
  };

  const getScoreBadgeStyles = (score: number) => {
    if (score >= 90) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        ringColor: 'text-emerald-600',
        label: 'BEST MATCH',
      };
    } else if (score >= 75) {
      return {
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        ringColor: 'text-blue-600',
        label: 'STRONG MATCH',
      };
    } else if (score >= 60) {
      return {
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        ringColor: 'text-amber-600',
        label: 'POSSIBLE MATCH',
      };
    } else {
      return {
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        ringColor: 'text-slate-500',
        label: 'WEAK MATCH',
      };
    }
  };

  if (!currentShift) {
    return (
      <EmptyState
        icon={<Clock className="w-6 h-6" />}
        title="Shift Not Found"
        description="Unable to locate the requested shift for candidate matching."
        actionLabel="Back to Dashboard"
        onAction={() => navigate('/hospital/dashboard')}
      />
    );
  }

  const invitedIds = currentShift.invitedProfessionalIds || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Page Title */}
      <PageHeader
        title="Best Matches"
        description="We found professionals who match this shift based on specialty, location, availability and experience."
        breadcrumbs={[
          { label: 'Hospital', href: '/hospital/dashboard' },
          { label: 'Open Shifts', href: '/hospital/shifts' },
          { label: 'Candidate Matches' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {!isMatchingActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplayAnimation}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Replay Analysis
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/hospital/shifts')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              All Shifts
            </Button>
          </div>
        }
      />

      {/* Shift Requirement Summary Card */}
      <Card padding="md" className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                Active Requirement
              </span>
              <StatusBadge status={currentShift.status} />
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {currentShift.priority}
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{currentShift.specialty}</span>
              <span className="text-slate-400 font-normal">·</span>
              <span className="text-slate-300 text-base">{currentShift.profession}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentShift.hospitalName} ({currentShift.department})</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentShift.city}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">{currentShift.dateLabel}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{currentShift.startTime} - {currentShift.endTime}</span>
              </span>
            </div>
          </div>

          {/* Rate and Switcher */}
          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/80 shrink-0">
            <span className="text-xs text-slate-400">Total Shift Pay</span>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums">
              £{currentShift.totalPay}
              <span className="text-xs font-normal text-slate-400 ml-1">
                (£{currentShift.hourlyRate}/hr)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Cinematic Matching Animation Modal/Banner (~2s sequence) */}
      <AnimatePresence>
        {isMatchingActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 animate-spin">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Finding healthcare professionals...
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Running 5-criteria compatibility engine (100 pts scale)
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipAnimation}
                icon={<FastForward className="w-3.5 h-3.5" />}
              >
                Skip Animation
              </Button>
            </div>

            {/* Stage Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 pt-2">
              {MATCH_STAGES.map((stage, idx) => {
                const isPassed = currentStageIdx > idx;
                const isCurrent = currentStageIdx === idx;

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0.5 }}
                    animate={{
                      opacity: isPassed || isCurrent ? 1 : 0.45,
                      scale: isCurrent ? 1.02 : 1,
                    }}
                    className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-colors ${
                      isPassed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800/60 dark:text-emerald-300'
                        : isCurrent
                        ? 'bg-teal-50 border-teal-400 text-teal-900 dark:bg-teal-950/40 dark:border-teal-700 dark:text-teal-200 font-semibold ring-1 ring-teal-400'
                        : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-500'
                    }`}
                  >
                    <span className="shrink-0">
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="w-3 h-3 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
                      ) : (
                        <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px] font-mono">
                          {stage.id}
                        </span>
                      )}
                    </span>
                    <span className="truncate">{stage.short}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Pacing Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-teal-500 h-full rounded-full"
                animate={{ width: `${(Math.min(currentStageIdx, MATCH_STAGES.length) / MATCH_STAGES.length) * 100}%` }}
                transition={{ ease: 'linear', duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Match Statistics Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="font-bold text-slate-900 dark:text-white">
            {filteredMatches.length} Compatible Professionals Found
          </span>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <span className="text-slate-600 dark:text-slate-400">
            {rankedMatches.filter((m) => m.score >= 90).length} rated 90%+ match
          </span>
          {favoriteProfessionalIds.length > 0 && (
            <button
              type="button"
              onClick={() => setFavoritesOnly((prev) => !prev)}
              className={`ml-2 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                favoritesOnly
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
              Favorites only ({favoriteProfessionalIds.length})
            </button>
          )}
        </div>

        {/* Filter by score */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Filter by Score:</span>
          <div className="flex items-center gap-1">
            {[
              { label: 'All Matches', min: 0 },
              { label: '60%+', min: 60 },
              { label: '75%+ Strong', min: 75 },
              { label: '90%+ Best', min: 90 },
            ].map((f) => (
              <button
                key={f.min}
                onClick={() => setMinScoreFilter(f.min)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  minScoreFilter === f.min
                    ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ranked Candidate Cards Grid */}
      {filteredMatches.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-6 h-6" />}
          title="No Candidates Match Filter"
          description="No healthcare professionals in the roster match your active score or favorite filter."
          actionLabel="Show All Matches"
          onAction={() => {
            setMinScoreFilter(0);
            setFavoritesOnly(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMatches.map((match) => {
            const prof = match.professional;
            const badge = getScoreBadgeStyles(match.score);
            const isInvited = invitedIds.includes(prof.id) || currentShift.matchedCandidateId === prof.id;
            const isFavorite = favoriteProfessionalIds.includes(prof.id);

            return (
              <Card
              key={prof.id}
              hoverEffect
              padding="none"
              className="overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Top Strip: Score Badge + Role */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={prof.avatarInitials}
                      name={prof.name}
                      gradient={prof.avatarColor}
                      size="lg"
                      status={prof.currentStatus}
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                          {prof.name}
                        </h3>
                        <span
                          title="Simulated Verification · Prototype Data"
                          className="inline-flex items-center text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900"
                        >
                          <ShieldCheck className="w-3 h-3 mr-0.5 text-blue-600 dark:text-blue-400" />
                          Demo Verified
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {prof.specialty} · <span className="font-normal text-slate-500 dark:text-slate-400">{prof.profession}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {prof.city} · {prof.experienceYears} years experience
                      </p>
                    </div>
                  </div>

                  {/* Actions & Match Score */}
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(prof)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isFavorite
                          ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                      }`}
                      title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex flex-col items-end px-2.5 py-1 rounded-lg border font-mono ${badge.badgeBg}`}
                      >
                        <span className="text-base font-extrabold leading-none tabular-nums">
                          {match.score}%
                        </span>
                        <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5">
                          {badge.label}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subspecialty / Bio snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {prof.bio}
                </p>

                {/* Algorithmic Match Reasons Checklist (Day 2 untouched scoring) */}
                <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Matching Breakdown:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                    {match.reasons.map((reason, idx) => {
                      const isPositive = reason.startsWith('✓');
                      const isPartial = reason.startsWith('~');

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 ${
                            isPositive
                              ? 'text-emerald-800 dark:text-emerald-400 font-medium'
                              : isPartial
                              ? 'text-amber-800 dark:text-amber-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span className="shrink-0">{reason.slice(0, 1)}</span>
                          <span className="truncate">{reason.slice(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Availability status line */}
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Availability:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{prof.currentStatus}</strong>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-slate-900 dark:text-white font-bold">
                    <span>£{prof.hourlyRate}/hr</span>
                    <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">indicative</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/professionals/${prof.id}`)}
                  icon={<User className="w-3.5 h-3.5" />}
                >
                  View Profile
                </Button>

                {isInvited ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Invitation Dispatched</span>
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenInvite(prof)}
                    icon={<Send className="w-3.5 h-3.5" />}
                  >
                    Invite to Shift
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* Invitation Confirmation Modal */}
      <InvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        professional={selectedProfessionalForInvite}
        shift={currentShift}
        onConfirmInvite={handleConfirmInvite}
      />
    </div>
  );
};
