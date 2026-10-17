import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  Building2,
  Stethoscope,
  Activity,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const handleSelectRole = (selectedRole: 'hospital' | 'professional') => {
    setRole(selectedRole);
    navigate(selectedRole === 'hospital' ? '/hospital/dashboard' : '/professional/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased selection:bg-teal-100">
      {/* Top minimal header */}
      <header className="p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Activity className="w-4 h-4" />
            </div>
            <span>MedShift</span>
          </Link>

          <Link
            to="/"
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back to Overview
          </Link>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Interactive Prototype Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Select Your Role
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Choose whether you are managing clinical hospital rotas or seeking shifts as a healthcare professional. You can switch between roles at any time from the top bar.
          </p>
        </div>

        {/* 2 Big Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Hospital */}
          <Card
            hoverEffect
            padding="lg"
            className="group cursor-pointer border-slate-200 hover:border-teal-500 transition-all flex flex-col justify-between"
            onClick={() => handleSelectRole('hospital')}
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Building2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                  NHS Trusts & Clinics (Demo)
                </span>
                <h2 className="text-xl font-bold text-slate-950 mt-1 group-hover:text-teal-700 transition-colors">
                  Hospital Rota Manager
                </h2>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  Post acute shift requirements, review 100-pt algorithmic candidate matches, and dispatch simulated shift invitations in your trust catchment.
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>St Mary's Hospital & Imperial Trust sample rota</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>5-step wizard with multi-submission prevention</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => handleSelectRole('hospital')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Enter Hospital Dashboard
              </Button>
            </div>
          </Card>

          {/* Card 2: Healthcare Professional */}
          <Card
            hoverEffect
            padding="lg"
            className="group cursor-pointer border-slate-200 hover:border-emerald-400 transition-all flex flex-col justify-between"
            onClick={() => handleSelectRole('professional')}
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Doctors · Nurses · Pharmacists
                </span>
                <h2 className="text-xl font-bold text-slate-950 mt-1 group-hover:text-emerald-700 transition-colors">
                  Healthcare Professional
                </h2>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  Maintain your clinical availability, browse high-value hospital shifts matching your specialty, and confirm bookings instantly.
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Simulating Dr. Sarah Mitchell (Dermatologist)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Toggle schedule slots & accept shifts</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => handleSelectRole('professional')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Enter Clinician Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-400">
        MedShift Healthcare Prototype · Switch roles at any time from the workspace top bar
      </footer>
    </div>
  );
};
