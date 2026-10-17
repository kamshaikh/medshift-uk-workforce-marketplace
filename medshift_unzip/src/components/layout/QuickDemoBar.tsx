import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Building2,
  Stethoscope,
} from 'lucide-react';

interface QuickDemoBarProps {
  onOpenResetModal: () => void;
}

interface DemoStep {
  num: number;
  label: string;
  role: 'hospital' | 'professional';
  path: string;
}

const DEMO_STEPS: DemoStep[] = [
  { num: 1, label: 'Hospital Rota', role: 'hospital', path: '/hospital/dashboard' },
  { num: 2, label: 'Post Shift', role: 'hospital', path: '/hospital/post-shift' },
  { num: 3, label: 'Match & Invite', role: 'hospital', path: '/hospital/matching-results' },
  { num: 4, label: 'Clinician Rota', role: 'professional', path: '/professional/dashboard' },
  { num: 5, label: 'Find & Accept', role: 'professional', path: '/professional/shifts' },
  { num: 6, label: 'Verified Coverage', role: 'hospital', path: '/hospital/dashboard' },
];

export const QuickDemoBar: React.FC<QuickDemoBarProps> = ({ onOpenResetModal }) => {
  const { role, setRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  // Determine current active step based on path and role
  const getCurrentStepIndex = (): number => {
    const p = location.pathname;
    if (p === '/hospital/post-shift') return 1;
    if (p === '/hospital/matching-results') return 2;
    if (role === 'professional') {
      if (p.includes('/shifts') || p.includes('/professional/shifts')) return 4;
      return 3;
    }
    if (p === '/hospital/dashboard') return 0;
    return 0;
  };

  const currentIdx = getCurrentStepIndex();

  const handleStepClick = (step: DemoStep) => {
    if (step.role !== role) {
      setRole(step.role);
    }
    navigate(step.path);
  };

  const handleToggleRole = () => {
    const nextRole = role === 'hospital' ? 'professional' : 'hospital';
    setRole(nextRole);
    navigate(nextRole === 'hospital' ? '/hospital/dashboard' : '/professional/dashboard');
  };

  const nextStep = DEMO_STEPS[(currentIdx + 1) % DEMO_STEPS.length];

  return (
    <div className="bg-slate-900 border-b border-teal-900/60 text-slate-200 text-xs shadow-md transition-all select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-teal-600 text-white font-bold">
              <Sparkles className="w-3 h-3" />
            </span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-bold text-white tracking-tight">Interview Demo Bar</span>
              <span className="hidden sm:inline text-teal-400 font-mono text-[11px]">
                (Step {currentIdx + 1} of 6)
              </span>
              <span className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Prototype · Local State
              </span>
            </div>
          </div>

          {/* Center: Stage breadcrumb pills (desktop & tablet) */}
          {isExpanded && (
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-0.5">
              {DEMO_STEPS.map((step, idx) => {
                const isActive = idx === currentIdx;
                const isPassed = idx < currentIdx;

                return (
                  <button
                    key={step.num}
                    onClick={() => handleStepClick(step)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs font-semibold ring-1 ring-teal-400/50'
                        : isPassed
                        ? 'bg-slate-800/80 text-teal-300 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                    title={`Go to Step ${step.num}: ${step.label} (${step.role})`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-3 h-3 text-teal-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-700/80 flex items-center justify-center text-[10px] font-mono">
                        {step.num}
                      </span>
                    )}
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Next Jump */}
            <button
              onClick={() => handleStepClick(nextStep)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-semibold text-[11px] transition-colors cursor-pointer"
              title={`Advance to ${nextStep.label}`}
            >
              <span>Next: {nextStep.label}</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Quick Role Switcher */}
            <button
              onClick={handleToggleRole}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
              title={`Switch role to ${role === 'hospital' ? 'Healthcare Professional' : 'Hospital'}`}
            >
              <ArrowLeftRight className="w-3 h-3 text-teal-400" />
              {role === 'hospital' ? (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-teal-400" />
                  <span className="font-semibold text-white">Hospital</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3 h-3 text-emerald-400" />
                  <span className="font-semibold text-white">Clinician</span>
                </span>
              )}
            </button>

            {/* Reset Demo Shortcut */}
            <button
              onClick={onOpenResetModal}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/50 text-[11px] font-medium transition-colors cursor-pointer"
              title="Reset prototype state for interview demonstration"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Collapse/Expand toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors hidden lg:inline-flex cursor-pointer"
              title={isExpanded ? 'Collapse demo bar' : 'Expand demo bar'}
              aria-label={isExpanded ? 'Collapse demo bar' : 'Expand demo bar'}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
