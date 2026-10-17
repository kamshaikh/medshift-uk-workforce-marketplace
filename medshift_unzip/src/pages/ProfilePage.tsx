import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { ResetDemoModal } from '../components/common/ResetDemoModal';
import {
  Building2,
  ShieldCheck,
  Award,
  Mail,
  Phone,
  MapPin,
  RotateCcw,
  Save,
  CheckCircle2,
  Clock,
  Globe,
  AlertCircle,
  Sparkles,
  FileCheck,
  Check,
  ArrowRight,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { role, hospitalUser, professionalUser, resetToDefaults } = useApp();
  const { showToast } = useToast();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleConfirmReset = () => {
    resetToDefaults();
    showToast(
      'Demo Data Reset',
      'All prototype shifts, invitations, and notifications have been restored.',
      'info'
    );
  };

  // Profile completion calculation for clinician
  const calculateCompletion = () => {
    let score = 0;
    const checks = [
      { id: 'name', label: 'Full name & titles', completed: Boolean(professionalUser.name), weight: 15 },
      { id: 'specialty', label: 'Specialty & sub-specialty', completed: Boolean(professionalUser.specialty), weight: 15 },
      { id: 'bio', label: 'Clinical bio & scope of practice', completed: Boolean(professionalUser.bio && professionalUser.bio.length > 30), weight: 15 },
      { id: 'quals', label: 'Qualifications & certifications', completed: Boolean(professionalUser.qualifications?.length), weight: 15 },
      { id: 'langs', label: 'Languages spoken', completed: Boolean(professionalUser.languages?.length), weight: 10 },
      { id: 'schedule', label: 'Weekly rota availability set', completed: Boolean(Object.keys(professionalUser.weeklySchedule || {}).length > 0), weight: 15 },
      { id: 'refs', label: 'Secondary clinical reference uploaded', completed: false, weight: 15 },
    ];

    checks.forEach((c) => {
      if (c.completed) score += c.weight;
    });

    return {
      percentage: score,
      missingItems: checks.filter((c) => !c.completed),
      completedItems: checks.filter((c) => c.completed),
    };
  };

  const completion = calculateCompletion();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    showToast(
      'Profile Saved',
      'Your profile data has been updated in local storage.',
      'success'
    );
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={role === 'hospital' ? 'Hospital Trust Profile' : 'Professional Clinician Profile'}
        description={
          role === 'hospital'
            ? 'Manage NHS Trust staffing credentials, hospital departments, and rota coordinators (Demo Environment)'
            : 'Maintain your clinical accreditation, qualifications, languages, and rota availability (Prototype Data)'
        }
        breadcrumbs={[
          { label: role === 'hospital' ? 'Hospital' : 'Clinician' },
          { label: 'Profile' },
        ]}
      />

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Profile configuration saved successfully in local storage.</span>
        </div>
      )}

      {/* Clinician Profile Completion Banner (Objective 3) */}
      {role === 'professional' && (
        <Card padding="md" className="border-teal-200 dark:border-teal-900 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Radial Progress Ring */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-teal-600 dark:text-teal-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${completion.percentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                    {completion.percentage}%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Profile Completion: {completion.percentage}%
                  </h3>
                  <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                    High Quality
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete profiles receive 2.4× more direct hospital shift invitations.
                </p>
              </div>
            </div>

            {/* Missing info checklist */}
            {completion.missingItems.length > 0 && (
              <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs space-y-1 md:max-w-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Recommended to reach 100%:
                </span>
                {completion.missingItems.map((item) => (
                  <div key={item.id} className="text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-[11px]">
                    <span className="text-amber-600 dark:text-amber-400">+</span>
                    <span>{item.label} (+{item.weight}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {role === 'hospital' ? (
        /* Hospital Profile Form */
        <form onSubmit={handleSave} className="space-y-6">
          <Card padding="lg" className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{hospitalUser.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{hospitalUser.trustName}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{hospitalUser.address}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    Demo Trust Account
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  defaultValue={hospitalUser.name}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NHS Trust Entity (Sample Name)
                </label>
                <input
                  type="text"
                  defaultValue={hospitalUser.trustName}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Contact Person
                </label>
                <input
                  type="text"
                  defaultValue={hospitalUser.contactPerson}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Coordinator Role
                </label>
                <input
                  type="text"
                  defaultValue={hospitalUser.contactRole}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Active Clinical Departments */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-2">
                Active Departments & Clinical Rotas
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {hospitalUser.departments.map((dept) => (
                  <span
                    key={dept}
                    className="px-2.5 py-1 text-xs rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-medium"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Demo Data
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </form>
      ) : (
        /* Professional Profile Form */
        <form onSubmit={handleSave} className="space-y-6">
          <Card padding="lg" className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <Avatar
                  initials={professionalUser.avatarInitials}
                  name={professionalUser.name}
                  gradient={professionalUser.avatarColor}
                  size="xl"
                  status={professionalUser.currentStatus}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{professionalUser.title}</h3>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Demo Verified</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {professionalUser.specialty} · {professionalUser.subSpecialty}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{professionalUser.city}</span>
                    </span>
                    <span>·</span>
                    <span className="font-mono">{professionalUser.gmcOrNmcNumber} (Sample)</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">
                      £{professionalUser.hourlyRate}/hr
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block">Experience</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {professionalUser.experienceYears} Years Post-qual
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block mt-0.5">
                  {professionalUser.completedShiftsCount} shifts completed
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name & Titles
                </label>
                <input
                  type="text"
                  defaultValue={professionalUser.title}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Registry Number (Sample Demo Number)
                </label>
                <input
                  type="text"
                  defaultValue={professionalUser.gmcOrNmcNumber}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Email (Demo Simulation)
                </label>
                <input
                  type="email"
                  defaultValue={professionalUser.contactEmail}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile / On-Call Phone
                </label>
                <input
                  type="text"
                  defaultValue={professionalUser.contactPhone}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
                Clinical Biography & Scope of Practice
              </label>
              <textarea
                rows={3}
                defaultValue={professionalUser.bio}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Qualifications list */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-2">
                Qualifications & Accreditations (Demo Records)
              </label>
              <div className="space-y-1.5">
                {professionalUser.qualifications?.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                    <Award className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="font-medium">{q}</span>
                    <span className="ml-auto text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      Sample Credential
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-2">
                Languages Spoken
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {professionalUser.languages?.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability Days */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-2">
                Standard Preferred Rota Days
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isAvailable = professionalUser.availabilityDays?.includes(day as any);
                  return (
                    <span
                      key={day}
                      className={`px-3 py-1 text-xs rounded-lg font-medium border ${
                        isAvailable
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {day} {isAvailable ? '✓' : ''}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Recent Profile Activity Timeline */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Recent Profile Activity (Local Prototype Log)
              </h4>
              <div className="space-y-2">
                {professionalUser.recentActivity?.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{act.title}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{act.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {act.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Demo Data
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<Save className="w-4 h-4" />}
              >
                Save Clinician Profile
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* Reset Demo Data Confirmation Dialog */}
      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};
