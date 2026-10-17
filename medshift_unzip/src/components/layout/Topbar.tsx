import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../common/Avatar';
import { NotificationCenter } from '../common/NotificationCenter';
import { ResetDemoModal } from '../common/ResetDemoModal';
import {
  Menu,
  ArrowLeftRight,
  Building2,
  Stethoscope,
  Sun,
  Moon,
  FlaskConical,
  RotateCcw,
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  onOpenPostShiftModal?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
}) => {
  const {
    role,
    setRole,
    hospitalUser,
    professionalUser,
    theme,
    toggleTheme,
    resetToDefaults,
  } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const toggleRole = () => {
    const nextRole = role === 'hospital' ? 'professional' : 'hospital';
    setRole(nextRole);
    navigate(nextRole === 'hospital' ? '/hospital/dashboard' : '/professional/dashboard');
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    showToast(
      'Demo Data Reset',
      'All prototype shifts, invitations, and notifications have been restored.',
      'info'
    );
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none transition-colors">
        {/* Left: Mobile hamburger + active context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
              {role === 'hospital' ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{hospitalUser.name}</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{professionalUser.title}</span>
                </>
              )}
            </span>
            <span>·</span>
            <span>
              {role === 'hospital'
                ? hospitalUser.trustName
                : `${professionalUser.specialty} Registrar`}
            </span>
          </div>

          {/* Prototype Environment Pill (Click to reset demo) */}
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            title="Click to reset prototype data"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[10px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <FlaskConical className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span>Prototype Demo</span>
            <RotateCcw className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {role === 'hospital' && (
            <button
              onClick={() => navigate('/hospital/post-shift')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>+ Post Shift</span>
            </button>
          )}

          {/* Role Switcher Button */}
          <button
            onClick={toggleRole}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title={`Switch view to ${role === 'hospital' ? 'Healthcare Professional' : 'Hospital'}`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">
              Viewing as <strong className="text-slate-900 dark:text-white capitalize">{role}</strong>
            </span>
            <span className="sm:hidden capitalize font-semibold">{role}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            )}
          </button>

          {/* Notification Center */}
          <NotificationCenter />

          {/* User Avatar */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
            title="View profile"
          >
            <Avatar
              initials={role === 'hospital' ? 'SM' : professionalUser.avatarInitials}
              name={role === 'hospital' ? hospitalUser.name : professionalUser.name}
              gradient={
                role === 'hospital'
                  ? 'from-teal-700 to-emerald-800'
                  : professionalUser.avatarColor
              }
              status={role === 'professional' ? professionalUser.currentStatus : undefined}
              size="md"
            />
            <div className="hidden lg:block text-left text-xs">
              <p className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight truncate max-w-[130px]">
                {role === 'hospital' ? hospitalUser.contactPerson : professionalUser.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {role === 'hospital' ? 'Staffing Lead' : 'Specialist'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Demo Data Modal */}
      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
};
