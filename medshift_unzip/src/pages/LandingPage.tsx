import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Sparkles,
  Users,
  Search,
  Calendar,
  Lock,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const [interactiveMatchScore, setInteractiveMatchScore] = useState(98);
  const [selectedSpecialty, setSelectedSpecialty] = useState<'Dermatology' | 'Emergency Medicine' | 'Neurology'>('Dermatology');

  const handleHospitalCTA = () => {
    setRole('hospital');
    navigate('/hospital/dashboard');
  };

  const handleProfessionalCTA = () => {
    setRole('professional');
    navigate('/professional/dashboard');
  };

  const interactiveSpecialtyData = {
    Dermatology: {
      hospital: "St Mary's Hospital, London",
      ward: 'Skin Day Unit & Rapid Triage',
      time: 'Tomorrow · 13:00 - 19:00',
      rate: '£88/hr',
      candidate: 'Dr. Sarah Mitchell',
      title: 'Dermatologist · 7y exp',
      gmc: 'GMC 7481923',
      score: 98,
      factors: ['Specialty & Subspecialty exact match', 'Within 3.2 miles of London W2', 'Schedule free in 13:00-19:00 window'],
    },
    'Emergency Medicine': {
      hospital: 'Manchester Royal Infirmary',
      ward: 'Resuscitation & Major Trauma',
      time: 'Today · 20:00 - 08:00',
      rate: '£52/hr',
      candidate: 'Marcus Evans',
      title: 'Emergency Nurse (Band 7) · 6y exp',
      gmc: 'NMC 14E0892E',
      score: 96,
      factors: ['ALS & Acute Resus certified', 'Available for night twilight rota', 'Active North West NHS Trust induction'],
    },
    Neurology: {
      hospital: 'Leeds General Infirmary',
      ward: 'Acute Stroke & CCU Ward',
      time: 'Today · 17:00 - 23:00',
      rate: '£95/hr',
      candidate: 'Dr. Tariq Khan',
      title: 'Consultant Neurologist · 10y exp',
      gmc: 'GMC 6829140',
      score: 99,
      factors: ['Thrombolysis on-call accredited', 'Immediate travel radius', 'Full compliance passport verified'],
    },
  };

  const currentMatch = interactiveSpecialtyData[selectedSpecialty];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-100 antialiased">
      {/* 1. Strict Top Bar Contract: Brand, Nav links, 1 Primary Action */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 font-bold tracking-tight text-xl whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <span>MedShift</span>
          </Link>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              How It Works
            </a>
            <a href="#for-hospitals" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              For Hospitals
            </a>
            <a href="#for-professionals" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              For Healthcare Professionals
            </a>
            <a href="#matching-tech" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Matching Engine
            </a>
            <a href="#trust" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Trust & Safety
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/role-selection')}
            >
              Enter Workspace
            </Button>
          </div>
        </div>
      </header>

      {/* Prototype Context Banner */}
      <div className="bg-teal-50 border-b border-teal-100 py-2.5 px-4 text-center text-xs text-teal-950 font-medium">
        <span className="font-bold uppercase tracking-wider text-[11px] bg-teal-200/70 text-teal-900 px-2 py-0.5 rounded mr-2">
          Prototype Environment
        </span>
        MedShift is a frontend-only healthcare workforce staffing marketplace prototype. All data, matching computations, notifications, and credentials are simulated locally. No real NHS or regulatory connection exists.
      </div>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                <span className="font-semibold text-slate-900">Healthcare workforce staffing marketplace prototype</span>
                <span className="text-slate-300">|</span>
                <span>Doctors · Nurses · Pharmacists</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.08] [text-wrap:balance]">
                Healthcare staffing,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700">
                  intelligently matched.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed [text-wrap:balance]">
                A demonstration prototype connecting hospitals with qualified healthcare professionals based on specialty, location and availability.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleHospitalCTA}
                  icon={<Building2 className="w-4 h-4" />}
                >
                  Find Healthcare Professionals
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleProfessionalCTA}
                  icon={<Users className="w-4 h-4" />}
                >
                  I'm a Healthcare Professional
                </Button>
              </div>

              {/* Trust Indicators Strip (Prototype Data Disclosures) */}
              <div className="pt-6 border-t border-slate-200/80 flex items-center gap-6 text-xs text-slate-500 flex-wrap">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Demo Verified Credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sample Credential Records</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span>Rapid Matching Engine Prototype</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Product Preview of Hospital Shift Being Matched */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-5 sm:p-6 space-y-4">
                {/* Live Match Simulator Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Live Matching Engine Preview
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {currentMatch.score}% Match Score
                  </span>
                </div>

                {/* Specialty Switcher Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                  {(['Dermatology', 'Emergency Medicine', 'Neurology'] as const).map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`py-1.5 px-2 rounded-md transition-all text-center truncate ${
                        selectedSpecialty === spec
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {spec === 'Emergency Medicine' ? 'Emergency' : spec}
                    </button>
                  ))}
                </div>

                {/* Simulated Hospital Requirement Card */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      Open Rota Requirement
                    </span>
                    <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200/90 px-2 py-0.5 rounded text-[11px]">
                      Urgent Rota Gap
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{currentMatch.hospital}</p>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{currentMatch.ward}</span>
                    <span className="font-mono font-semibold text-slate-900">{currentMatch.rate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentMatch.time}</span>
                  </div>
                </div>

                {/* Intelligently Matched Candidate Card */}
                <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-teal-900 uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Algorithmic Candidate Match
                    </span>
                    <span className="text-[10px] text-teal-800 bg-white px-1.5 py-0.5 rounded border border-teal-200 font-medium">
                      Sample Verified (Demo)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs">
                      {currentMatch.candidate.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {currentMatch.candidate}
                      </p>
                      <p className="text-slate-600 text-[11px]">{currentMatch.title}</p>
                      <p className="text-slate-500 text-[10px] font-mono">{currentMatch.gmc} (Sample)</p>
                    </div>
                  </div>

                  {/* Matching Factor List */}
                  <div className="space-y-1.5 pt-2 border-t border-teal-100">
                    {currentMatch.factors.map((factor, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instant Match Action CTA */}
                <div className="pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setRole('hospital');
                      navigate('/hospital/matching-results?shiftId=shift-104');
                    }}
                    icon={<Zap className="w-4 h-4 text-amber-300" />}
                  >
                    Confirm Match & Allocate Shift
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How MedShift Works */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Operational Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How MedShift Works
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Demonstrating direct, algorithmic clinical shift matching between simulated hospital rotas and sample healthcare professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Hospital Posts Shift</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hospital rota coordinators specify specialty, required clinical grade, hospital ward, and shift hours in a 5-step wizard.
              </p>
              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Synchronized directly into shared local state</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Algorithmic Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The 100-point engine evaluates clinical specialty (30), location radius (20), rota availability (30), and experience (15).
              </p>
              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Deterministic scoring breakdown and ranking</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">1-Click Booking & Confirmed Rota</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sample clinicians review shift briefings and accept in one click. Single canonical shift status updates to Filled across all views.
              </p>
              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant synchronized notification update</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. For Hospitals */}
      <section id="for-hospitals" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                For Hospital Workforce Teams & Coordinators
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Fill acute clinical rota gaps directly in minutes.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Hospital staffing coordinators spend countless hours phoning traditional agencies and maintaining fragmented rotas. MedShift models an intelligent marketplace connecting wards with sample clinicians.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Rapid Emergency Shift Dispatch</h4>
                    <p className="text-xs text-slate-600">Urgent rota gaps flagged and evaluated against available clinicians in your regional trust radius.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Simulated Credential Profiles</h4>
                    <p className="text-xs text-slate-600">Sample clinician profiles with simulated registration status, mock grades, and demonstration vetting checks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Transparent Trust Rates</h4>
                    <p className="text-xs text-slate-600">Standardized rate caps, clear duration calculations, and zero hidden agency overhead.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="primary" size="md" onClick={handleHospitalCTA}>
                  Explore Hospital Rota Dashboard
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Rota Coordinator Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1">Average Fill Time</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">14.2 min</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1">Fill Rate Reliability</span>
                  <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">98.4%</span>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
                <span className="font-semibold text-slate-900">Active Shift Requirement Example:</span>
                <p className="text-slate-600">
                  Emergency Nurse · Resus Bay · London · Tonight 20:00 - 08:00 · £52/hr
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-700 font-medium">3 matched candidates ready</span>
                  <span className="text-teal-600 font-semibold cursor-pointer" onClick={handleHospitalCTA}>
                    View & Dispatch →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. For Healthcare Professionals */}
      <section id="for-professionals" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-xs">
                    SM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dr. Sarah Mitchell</h4>
                    <p className="text-[11px] text-slate-400">Dermatologist · London</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded">
                  Available Today
                </span>
              </div>

              {/* Schedule slot mockup */}
              <div className="space-y-2 text-xs">
                <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  Today's Schedule View (Demo)
                </span>
                <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                  <span>09:00 - 17:00</span>
                  <span className="text-slate-400">St Mary's Hospital</span>
                  <span className="text-teal-400 font-semibold">Working</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                  <span>17:00 - 23:00</span>
                  <span className="text-emerald-400">Locum Available</span>
                  <span className="text-emerald-400 font-semibold">Open</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                  <span>23:00 - 08:00</span>
                  <span className="text-slate-500">Rest Period</span>
                  <span className="text-slate-500">Unavailable</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Completed Shifts: 142 (Sample)</span>
                <span className="text-amber-400">Rating: 4.95 / 5.0</span>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                For Healthcare Professionals
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Complete control over your rota, rates and locations.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Choose shifts when and where it suits you. Maintain your weekly availability, review tailored shift opportunities matching your specialty, and confirm bookings directly.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Fine-Grained Availability Control</h4>
                    <p className="text-xs text-slate-600">Toggle hourly or daily rota availability blocks in real time with interactive status feedback.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Transparent Compensation Details</h4>
                    <p className="text-xs text-slate-600">Clear total pay calculations, duration breakdowns, and department handover orientation notes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Sample Credential Profile</h4>
                    <p className="text-xs text-slate-600">Demonstrates structured professional profiles with simulated grade, qualifications, and specialty experience.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="secondary" size="md" onClick={handleProfessionalCTA}>
                  View Clinician Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Matching Technology */}
      <section id="matching-tech" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Algorithmic Alignment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Multi-Variable Matching Technology
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              How MedShift accurately evaluates clinical fit, geographic feasibility, and schedule availability (100-Point Scoring Model).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Specialty Matching (30 pts)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates specialty competencies and transferable clinical skills between emergency, general, and acute departments.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Regional Trust Catchment (20 pts)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assesses geographic compatibility based on clinician city location and regional NHS trust hospital boundaries.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Rota Availability (30 pts)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Checks live clinician on-call status, active shift slots, and weekly recurring schedule availability blocks.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Experience & Profession (20 pts)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verifies minimum post-qualification clinical experience requirements (15 pts) and profession designation (5 pts).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Trust and Safety (Prototype Disclosures) */}
      <section id="trust" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
            <div className="max-w-3xl space-y-4 mb-8">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Simulated Governance & Prototype Framework
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Designed for Healthcare Workforce Demonstrations
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                This prototype demonstrates structured clinician verification workflows with sample records, demo credential statuses, and localized state persistence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">Demo Registry Records</h4>
                <p className="text-xs text-slate-400">Sample clinician registry profiles (GMC/NMC simulated demonstration data).</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">Simulated Safeguarding Checks</h4>
                <p className="text-xs text-slate-400">Demonstrates automated clearance checks within local prototype state.</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">Prototype Induction Passport</h4>
                <p className="text-xs text-slate-400">Sample documentation records for hospital ward orientations and guideline reviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Ready to experience intelligent healthcare staffing?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Test the interactive prototype as a Hospital Rota Manager or as a Healthcare Professional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleHospitalCTA}
              icon={<Building2 className="w-4 h-4" />}
            >
              Launch Hospital Workspace
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleProfessionalCTA}
              icon={<Users className="w-4 h-4" />}
            >
              Launch Clinician Workspace
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 bg-white border-t border-slate-200/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-900">MedShift</span>
            <span>·</span>
            <span>Healthcare staffing, intelligently matched.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/role-selection" className="hover:text-slate-900 transition-colors">
              Role Selection
            </Link>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              Workflow
            </a>
            <span className="text-slate-400">Prototype Demo (Frontend Only)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
