import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ResetDemoModal } from '../common/ResetDemoModal';
import {
  LayoutDashboard,
  CalendarPlus,
  Users,
  Clock,
  User,
  CalendarCheck,
  Search,
  Activity,
  ArrowLeftRight,
  RotateCcw,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
  onOpenPostShiftModal?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: (e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile, onOpenPostShiftModal }) => {
  const { role, setRole, hospitalUser, professionalUser, resetToDefaults } = useApp();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleRoleToggle = () => {
    const nextRole = role === 'hospital' ? 'professional' : 'hospital';
    setRole(nextRole);
    navigate(nextRole === 'hospital' ? '/hospital/dashboard' : '/professional/dashboard');
    if (onCloseMobile) onCloseMobile();
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    showToast(
      'Demo Data Reset',
      'All prototype shifts, invitations, and notifications have been restored to initial demo state.',
      'info'
    );
  };

  const hospitalNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/hospital/dashboard', icon: LayoutDashboard },
    {
      label: 'Post Shift',
      href: '/hospital/post-shift',
      icon: CalendarPlus,
    },
    { label: 'Find Professionals', href: '/hospital/professionals', icon: Users },
    { label: 'Open Shifts', href: '/hospital/shifts', icon: Clock },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const professionalNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/professional/dashboard', icon: LayoutDashboard },
    { label: 'My Availability', href: '/professional/availability', icon: CalendarCheck },
    { label: 'Find Shifts', href: '/professional/shifts', icon: Search },
    { label: 'My Shifts', href: '/professional/shifts?view=booked', icon: Clock },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const navItems = role === 'hospital' ? hospitalNavItems : professionalNavItems;

  return (
    <>
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 text-white font-bold tracking-tight text-lg group"
            onClick={onCloseMobile}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-500 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <span>MedShift</span>
          </NavLink>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 bg-slate-800/90 px-1.5 py-0.5 rounded border border-teal-800/60">
            PROTOTYPE
          </span>
        </div>

        {/* Role Pill Indicator in Sidebar */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Active Workspace</span>
              <span
                className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                  role === 'hospital'
                    ? 'bg-teal-900/60 text-teal-300 border border-teal-700/50'
                    : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                }`}
              >
                {role === 'hospital' ? 'Hospital' : 'Clinician'}
              </span>
            </div>
            <p className="text-xs font-semibold text-white truncate">
              {role === 'hospital' ? hospitalUser.name : professionalUser.name}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {role === 'hospital' ? hospitalUser.city : `${professionalUser.specialty} · ${professionalUser.city}`}
            </p>
          </div>
        </div>

        {/* Nav List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href.split('?')[0] ||
              (item.href.includes('?view=booked') && location.search.includes('view=booked'));

            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    item.onClick(e);
                  } else if (onCloseMobile) {
                    onCloseMobile();
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions: Role Switcher & Reset Demo Data */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Reset Demo Data Button */}
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-amber-300 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg transition-colors border border-slate-700/40 cursor-pointer"
            title="Reset prototype state for interview demonstration"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Demo Data</span>
            </span>
            <span className="text-[10px] text-amber-400/90 bg-amber-950/50 border border-amber-800/50 px-1.5 py-0.2 rounded font-mono">
              Demo
            </span>
          </button>

          {/* Role Switcher Button */}
          <button
            onClick={handleRoleToggle}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" />
              <span>Switch to {role === 'hospital' ? 'Professional' : 'Hospital'}</span>
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-1 py-0.5 rounded">
              Tab
            </span>
          </button>

          <div className="px-2 pt-1 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
            <span>MedShift Prototype</span>
            <span>·</span>
            <span className="text-teal-500 font-mono">v1.0</span>
          </div>
        </div>
      </aside>

      {/* Reset Demo Data Confirmation Dialog */}
      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
};
