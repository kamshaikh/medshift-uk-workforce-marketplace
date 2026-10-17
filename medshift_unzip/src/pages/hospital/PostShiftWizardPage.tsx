import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Profession, Specialty, UKCity, ShiftPriority } from '../../types';
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const PostShiftWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { postNewShift, hospitalUser, hospitals } = useApp();
  const { showToast } = useToast();
  const isPublishingRef = useRef(false);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Requirement
  const [profession, setProfession] = useState<Profession>('Doctor');
  const [specialty, setSpecialty] = useState<Specialty>('Emergency Medicine');
  const [subSpecialty, setSubSpecialty] = useState('');

  // Step 2: Schedule
  const [dateLabel, setDateLabel] = useState('Today');
  const [customDate, setCustomDate] = useState('2026-10-18');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('23:00');
  const [durationHours, setDurationHours] = useState(6);

  // Step 3: Location
  const [city, setCity] = useState<UKCity>(hospitalUser.city);
  const [hospitalId, setHospitalId] = useState(hospitalUser.id);
  const [department, setDepartment] = useState('Acute Assessment Unit & Resuscitation');
  const [locationDetails, setLocationDetails] = useState('Ward 4B, Cambridge Wing');

  // Step 4: Preferences
  const [requiredExperienceYears, setRequiredExperienceYears] = useState(4);
  const [urgency, setUrgency] = useState<ShiftPriority>('Urgent');
  const [hourlyRate, setHourlyRate] = useState(88);
  const [notes, setNotes] = useState('Urgent on-call cover required. Fast-track induction and full handover provided upon arrival.');
  const [isPublishing, setIsPublishing] = useState(false);

  const selectedHospital = hospitals.find((h) => h.id === hospitalId) || hospitalUser;

  // Calculate duration if start and end change
  const handleTimeChange = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
    const startHour = parseInt(start.split(':')[0], 10) || 0;
    let endHour = parseInt(end.split(':')[0], 10) || 0;
    if (endHour <= startHour) endHour += 24; // overnight shift
    setDurationHours(Math.max(1, endHour - startHour));
  };

  const calculatedTotal = durationHours * hourlyRate;

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as any);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handlePublish = () => {
    if (isPublishingRef.current || isPublishing) return;
    isPublishingRef.current = true;
    setIsPublishing(true);

    const finalDate = dateLabel === 'Custom' ? customDate : dateLabel;

    const newShift = postNewShift({
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      trustName: selectedHospital.trustName,
      department,
      profession,
      specialty,
      city,
      locationDetails,
      dateLabel: finalDate,
      startTime,
      endTime,
      durationHours,
      priority: urgency,
      hourlyRate,
      requiredExperienceYears,
      notes,
    });

    showToast(
      'Shift published successfully',
      `${specialty} shift created. Matching engine analyzing available clinicians...`,
      'success'
    );

    // Route directly to matching results page with new shift ID!
    navigate(`/hospital/matching-results?shiftId=${newShift.id}`);
  };

  const stepTitles = [
    { num: 1, title: 'Requirement', desc: 'Profession & Specialty' },
    { num: 2, title: 'Schedule', desc: 'Date & Times' },
    { num: 3, title: 'Location', desc: 'Hospital & Ward' },
    { num: 4, title: 'Preferences', desc: 'Experience & Rate' },
    { num: 5, title: 'Review', desc: 'Confirm & Publish' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Post a Shift Requirement"
        description="Publish clinical vacancies to match with qualified, available healthcare professionals."
        breadcrumbs={[
          { label: 'Hospital', href: '/hospital/dashboard' },
          { label: 'Post Shift' },
        ]}
      />

      {/* Progress Indicators Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
        <div className="grid grid-cols-5 gap-2">
          {stepTitles.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div
                key={step.num}
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num as any);
                }}
                className={`flex flex-col items-center sm:items-start p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800'
                    : isCompleted
                    ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'
                    : 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isCompleted ? '✓' : step.num}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white hidden sm:inline">
                    {step.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block truncate w-full">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <Card padding="lg" className="min-h-[420px] flex flex-col justify-between bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800">
        {/* STEP 1: REQUIREMENT */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Step 1: Clinical Requirement
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select the clinical role and medical specialty needed for this shift.
              </p>
            </div>

            {/* Profession Radio Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Healthcare Profession
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Doctor', title: 'Doctor / Physician', desc: 'Registrars, Consultants, SHO' },
                  { id: 'Nurse', title: 'Specialist Nurse', desc: 'Band 5, 6, 7 & Practitioner' },
                  { id: 'Pharmacist', title: 'Clinical Pharmacist', desc: 'Ward & Prescribing Pharmacists' },
                ].map((prof) => (
                  <div
                    key={prof.id}
                    onClick={() => setProfession(prof.id as Profession)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      profession === prof.id
                        ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 dark:border-teal-700 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{prof.title}</span>
                      <input
                        type="radio"
                        name="profession"
                        checked={profession === prof.id}
                        onChange={() => {}}
                        className="text-teal-600 pointer-events-none accent-teal-600"
                      />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{prof.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialty Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Medical Specialty
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  'Cardiology',
                  'Dermatology',
                  'Neurology',
                  'Gastroenterology',
                  'Emergency Medicine',
                  'Pediatrics',
                  'Orthopedics',
                  'General Medicine',
                ].map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setSpecialty(spec as Specialty)}
                    className={`p-3 rounded-lg border text-xs font-semibold text-left transition-all cursor-pointer ${
                      specialty === spec
                        ? 'border-teal-600 bg-teal-600 text-white shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Sub-specialty */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sub-Specialty Focus (Optional)
              </label>
              <input
                type="text"
                value={subSpecialty}
                onChange={(e) => setSubSubSpecialty ? setSubSpecialty(e.target.value) : setSubSpecialty(e.target.value)}
                placeholder="e.g. Acute Resuscitation, Paediatric Dermatology, Interventional CCU"
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        )}

        {/* STEP 2: SCHEDULE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Step 2: Shift Schedule
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Specify shift date, working hours, and total duration.
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Shift Date
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Today', 'Tomorrow', '16 Oct 2026', '17 Oct 2026'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDateLabel(d)}
                    className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                      dateLabel === d
                        ? 'border-teal-600 bg-teal-600 text-white shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mx-auto mb-1 opacity-80" />
                    <span>{d}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Presets & Custom Hours */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Rota Shift Hours
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Day Shift', start: '09:00', end: '17:00', hrs: 8 },
                  { label: 'Twilight / On-Call', start: '17:00', end: '23:00', hrs: 6 },
                  { label: 'Overnight Resus', start: '20:00', end: '08:00', hrs: 12 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleTimeChange(preset.start, preset.end)}
                    className={`p-3 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                      startTime === preset.start && endTime === preset.end
                        ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{preset.label}</p>
                    <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mt-0.5">
                      {preset.start} - {preset.end} ({preset.hrs} hrs)
                    </p>
                  </button>
                ))}
              </div>

              {/* Exact time inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => handleTimeChange(e.target.value, endTime)}
                    className="w-full text-xs p-2.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => handleTimeChange(startTime, e.target.value)}
                    className="w-full text-xs p-2.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Computed Duration
                  </label>
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{durationHours} hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Step 3: Hospital Location
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm trust location, hospital facility, and ward details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UK City / Region
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    const nextCity = e.target.value as UKCity;
                    setCity(nextCity);
                    const matchingHosp = hospitals.find((h) => h.city === nextCity);
                    if (matchingHosp) setHospitalId(matchingHosp.id);
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="London">London</option>
                  <option value="Manchester">Manchester</option>
                  <option value="Birmingham">Birmingham</option>
                  <option value="Leeds">Leeds</option>
                  <option value="Bristol">Bristol</option>
                  <option value="Liverpool">Liverpool</option>
                  <option value="Edinburgh">Edinburgh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Facility
                </label>
                <select
                  value={hospitalId}
                  onChange={(e) => {
                    setHospitalId(e.target.value);
                    const h = hospitals.find((item) => item.id === e.target.value);
                    if (h) setCity(h.city);
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Department / Unit
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Acute Assessment Unit (AAU), Ward 32"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ward Details & Access Point
              </label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="e.g. Level 2, Cambridge Wing, report to Sister in Charge"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        )}

        {/* STEP 4: PREFERENCES */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Step 4: Clinical Preferences & Remuneration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set minimum experience requirement, urgency priority, and hourly rate.
              </p>
            </div>

            {/* Urgency Radio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Shift Urgency
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'Normal',
                    label: 'Normal Rota Gap',
                    desc: 'Standard rota coverage planned in advance',
                    badge: 'Normal',
                  },
                  {
                    id: 'High',
                    label: 'High Priority',
                    desc: 'Need filled within 24 hours to prevent deficit',
                    badge: 'High Priority',
                  },
                  {
                    id: 'Urgent',
                    label: 'Urgent (Immediate)',
                    desc: 'Critical escalation, immediate on-call dispatch',
                    badge: 'Urgent',
                  },
                ].map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setUrgency(u.id as ShiftPriority)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      urgency === u.id
                        ? u.id === 'Urgent'
                          ? 'border-rose-500 bg-rose-50/60 shadow-2xs'
                          : 'border-blue-600 bg-blue-50/60 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{u.label}</span>
                      <input
                        type="radio"
                        name="urgency"
                        checked={urgency === u.id}
                        onChange={() => {}}
                        className="text-blue-600 pointer-events-none"
                      />
                    </div>
                    <p className="text-slate-500 text-[11px] leading-snug">{u.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate & Experience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hourly Rate (£/hour)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-700">£</span>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">/ hr</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum Experience
                </label>
                <select
                  value={requiredExperienceYears}
                  onChange={(e) => setRequiredExperienceYears(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={2}>2+ years (Core Trainee / Staff Nurse)</option>
                  <option value={4}>4+ years (Registrar / Senior Staff Nurse)</option>
                  <option value={6}>6+ years (Senior Registrar / Band 7)</option>
                  <option value={8}>8+ years (Consultant / Nurse Practitioner)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Handover Notes & Clinical Guidelines
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include access codes, induction details, or emergency equipment locations..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Step 5: Review & Publish Requirement
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm shift details before submitting to the intelligent matching engine.
                </p>
              </div>
              <StatusBadge status={urgency} />
            </div>

            {/* Complete Review Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4 text-xs">
              {/* Header */}
              <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {specialty} {profession}
                    </h3>
                    <span className="font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {profession}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{department}</p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Total Shift Budget</span>
                  <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                    £{calculatedTotal}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      (£{hourlyRate}/hr · {durationHours} hrs)
                    </span>
                  </span>
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block mb-1 flex items-center gap-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Facility
                  </span>
                  <p className="font-bold text-slate-900">{selectedHospital.name}</p>
                  <p className="text-slate-500 text-[11px]">{selectedHospital.trustName}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block mb-1 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Schedule
                  </span>
                  <p className="font-bold text-slate-900">{dateLabel}</p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    {startTime} - {endTime} ({durationHours} hrs)
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block mb-1 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Standards
                  </span>
                  <p className="font-bold text-slate-900">{requiredExperienceYears}+ Years Experience</p>
                  <p className="text-teal-700 text-[11px]">Demo Verified (Sample Rota)</p>
                </div>
              </div>

              {/* Handover notes preview */}
              {notes && (
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="font-semibold text-slate-900 block mb-0.5">Clinical Notes:</span>
                  <p className="text-slate-600 leading-relaxed">{notes}</p>
                </div>
              )}
            </div>

            {/* Matching Engine Callout */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">Automated Matching Ready</p>
                <p className="text-blue-700 mt-0.5">
                  Publishing will immediately rank all vetted {specialty} {profession}s in {city} by specialty, location, availability, and clinical grade.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Continue to {stepTitles[currentStep].title}
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handlePublish}
              isLoading={isPublishing}
              disabled={isPublishing}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Publish Shift & Find Matches
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
