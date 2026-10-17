import React from 'react';
import { HealthcareProfessional } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle,
  Briefcase,
  Heart,
} from 'lucide-react';

interface ProfessionalCardProps {
  professional: HealthcareProfessional;
  onViewProfile?: (professional: HealthcareProfessional) => void;
  onInviteToShift?: (professional: HealthcareProfessional) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onViewProfile,
  onInviteToShift,
}) => {
  const { favoriteProfessionalIds, toggleFavoriteProfessional } = useApp();
  const { showToast } = useToast();
  const isFavorite = favoriteProfessionalIds.includes(professional.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFav = toggleFavoriteProfessional(professional.id);
    showToast(
      isNowFav ? 'Saved to Favorites' : 'Removed from Favorites',
      `${professional.name} ${isNowFav ? 'added to' : 'removed from'} your hospital favorite list.`,
      'info'
    );
  };

  return (
    <Card hoverEffect padding="none" className="overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="p-5">
        {/* Top Header: Avatar + Name + Demo Verified Badge + Favorite button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar
              initials={professional.avatarInitials}
              name={professional.name}
              gradient={professional.avatarColor}
              size="lg"
              status={professional.currentStatus}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {professional.name}
                </h3>
                {professional.verifiedCredentials && (
                  <span
                    title="Demo Verified · Simulated Credential"
                    className="inline-flex items-center text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900"
                  >
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Demo Verified
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {professional.specialty} · {professional.profession}
              </p>

              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{professional.city}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{professional.experienceYears}y exp</span>
                </span>
              </div>
            </div>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
              isFavorite
                ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400'
                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-300'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {professional.bio}
        </p>

        {/* Ratings & Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span className="font-semibold tabular-nums">{professional.rating}</span>
            <span className="text-slate-400 dark:text-slate-500">({professional.completedShiftsCount} shifts)</span>
          </div>

          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 justify-end">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">{professional.currentStatus}</span>
          </div>
        </div>
      </div>

      {/* Footer: Rate + CTA */}
      <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">Indicative Rate</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            £{professional.hourlyRate}/hr
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onViewProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(professional)}
            >
              Profile
            </Button>
          )}

          {onInviteToShift && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onInviteToShift(professional)}
            >
              Request Shift
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
