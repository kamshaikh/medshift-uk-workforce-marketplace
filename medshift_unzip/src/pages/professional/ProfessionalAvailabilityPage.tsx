import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ScheduleSlot } from '../../types';
import {
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ProfessionalAvailabilityPage: React.FC = () => {
  const { professionalUser, updateWeeklySchedule } = useApp();
  const { showToast } = useToast();

  const [activeDay, setActiveDay] = useState<string>('Monday');
  const [schedule, setSchedule] = useState<Record<string, ScheduleSlot[]>>(() => {
    return professionalUser.weeklySchedule || {};
  });

  const [minRate, setMinRate] = useState<number>(professionalUser.hourlyRate);
  const [commuteRadius, setCommuteRadius] = useState<number>(15);

  const currentDaySlots = schedule[activeDay] || [];

  // Toggle status of a slot between Available, Working, Unavailable
  const handleToggleStatus = (slotId: string) => {
    setSchedule((prev) => {
      const currentSlots = prev[activeDay] || [];
      const updated = currentSlots.map((slot) => {
        if (slot.id === slotId) {
          const nextStatus: 'Available' | 'Unavailable' | 'Working' =
            slot.status === 'Available'
              ? 'Unavailable'
              : slot.status === 'Unavailable'
              ? 'Working'
              : 'Available';

          const nextLocation =
            nextStatus === 'Working'
              ? "St Mary's Hospital (Substantive)"
              : nextStatus === 'Available'
              ? 'Open for Locum / On-Call'
              : 'Off Duty (Mandatory Rest)';

          return { ...slot, status: nextStatus, location: nextLocation };
        }
        return slot;
      });
      return { ...prev, [activeDay]: updated };
    });
  };

  // Update time of a slot
  const handleTimeChange = (slotId: string, field: 'startTime' | 'endTime', value: string) => {
    setSchedule((prev) => {
      const currentSlots = prev[activeDay] || [];
      const updated = currentSlots.map((slot) =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      );
      return { ...prev, [activeDay]: updated };
    });
  };

  // Add new block to current day
  const handleAddSlot = () => {
    const newSlot: ScheduleSlot = {
      id: `slot-${activeDay.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      startTime: '13:00',
      endTime: '19:00',
      status: 'Available',
      location: 'Locum Available Window',
    };
    setSchedule((prev) => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] || []), newSlot],
    }));
  };

  // Remove slot
  const handleRemoveSlot = (slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [activeDay]: (prev[activeDay] || []).filter((s) => s.id !== slotId),
    }));
  };

  // Save changes
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeeklySchedule(schedule);
    showToast(
      'Availability Updated',
      'Your weekly rota preferences and time blocks have been saved and synced with the matching engine.',
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="My Availability & Weekly Rota"
        description="Configure your recurring weekly availability blocks. Hospitals search and match based on these windows."
        breadcrumbs={[
          { label: 'Clinician', href: '/professional/dashboard' },
          { label: 'My Availability' },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveAll}
            icon={<Save className="w-4 h-4" />}
          >
            Save Availability
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Day Selector Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <Card padding="md" className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Day of Week
            </span>

            <div className="space-y-1">
              {DAYS_OF_WEEK.map((day) => {
                const slots = schedule[day] || [];
                const availableCount = slots.filter((s) => s.status === 'Available').length;
                const workingCount = slots.filter((s) => s.status === 'Working').length;
                const isSelected = activeDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setActiveDay(day)}
                    className={`w-full p-3 rounded-lg text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    <span>{day}</span>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      {workingCount > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-blue-700 text-blue-100' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {workingCount} on rota
                        </span>
                      )}
                      {availableCount > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {availableCount} available
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Rate and Radius Preferences */}
          <Card padding="md" className="space-y-3 text-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Matching Thresholds
            </span>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Minimum Acceptable Rate
              </label>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">£</span>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={minRate}
                  onChange={(e) => setMinRate(Number(e.target.value))}
                  className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
                <span className="text-slate-500">/ hour</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Commute Radius</span>
                <span className="font-mono text-blue-600 font-bold">{commuteRadius} miles</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={commuteRadius}
                onChange={(e) => setCommuteRadius(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </Card>
        </div>

        {/* Day Slots Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{activeDay} Schedule Blocks</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on status pills to cycle between Available, Working, and Unavailable.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSlot}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Time Block
              </Button>
            </div>

            {/* Slots List */}
            {currentDaySlots.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                <p className="font-semibold text-slate-700">No time blocks configured for {activeDay}.</p>
                <p className="mt-1">Add a time block to declare your availability or working commitments.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddSlot}
                  className="mt-3"
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Block
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentDaySlots.map((slot) => {
                  const isWorking = slot.status === 'Working';
                  const isAvailable = slot.status === 'Available';

                  return (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                        isWorking
                          ? 'bg-blue-50/70 border-blue-200'
                          : isAvailable
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {/* Time Range Inputs */}
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleTimeChange(slot.id, 'startTime', e.target.value)}
                          className="p-2 font-mono font-bold text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-center"
                        />
                        <span className="text-slate-400 font-bold">-</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleTimeChange(slot.id, 'endTime', e.target.value)}
                          className="p-2 font-mono font-bold text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-center"
                        />
                      </div>

                      {/* Location / Note */}
                      <div className="flex-1 min-w-0 sm:px-2">
                        <input
                          type="text"
                          value={slot.location || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSchedule((prev) => {
                              const updated = (prev[activeDay] || []).map((s) =>
                                s.id === slot.id ? { ...s, location: val } : s
                              );
                              return { ...prev, [activeDay]: updated };
                            });
                          }}
                          placeholder="e.g. St Mary's Hospital / Locum Open"
                          className="w-full p-2 bg-white/80 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      {/* Status Toggle & Remove */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(slot.id)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            isWorking
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : isAvailable
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-300 text-slate-800'
                          }`}
                          title="Click to cycle status"
                        >
                          {slot.status}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Delete time block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick helper notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 text-slate-500 text-[11px] leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Working:</strong> Declares substantive rota hours (shifts won't clash). <strong>Available:</strong> Flags your profile as high match for local trust requirements. <strong>Unavailable:</strong> Mandatory European Working Time Directive rest.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
