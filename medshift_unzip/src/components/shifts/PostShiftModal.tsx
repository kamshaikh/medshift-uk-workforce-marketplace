import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Profession, Specialty, UKCity, ShiftPriority } from '../../types';

interface PostShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostShiftModal: React.FC<PostShiftModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { postNewShift, hospitalUser } = useApp();
  const { showToast } = useToast();
  const isSubmittingRef = useRef(false);

  const [profession, setProfession] = useState<Profession>('Doctor');
  const [specialty, setSpecialty] = useState<Specialty>('Emergency Medicine');
  const [city, setCity] = useState<UKCity>(hospitalUser.city);
  const [department, setDepartment] = useState('Emergency Department, Resus');
  const [locationDetails, setLocationDetails] = useState('Ground Floor, Block A');
  const [dateLabel, setDateLabel] = useState('Today');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('23:00');
  const [durationHours, setDurationHours] = useState(6);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [priority, setPriority] = useState<ShiftPriority>('Urgent');
  const [requiredExperienceYears, setRequiredExperienceYears] = useState(4);
  const [notes, setNotes] = useState('Urgent cover required due to acute rota gap. Full trust induction provided.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    const newShift = postNewShift({
      hospitalId: hospitalUser.id,
      hospitalName: hospitalUser.name,
      trustName: hospitalUser.trustName,
      department,
      profession,
      specialty,
      city,
      locationDetails,
      dateLabel,
      startTime,
      endTime,
      durationHours: Number(durationHours),
      priority,
      hourlyRate: Number(hourlyRate),
      requiredExperienceYears: Number(requiredExperienceYears),
      notes,
    });
    showToast(
      'Shift Requirement Published',
      `Finding best matching professionals for ${specialty}...`,
      'success'
    );
    onClose();
    navigate(`/hospital/matching-results?shiftId=${newShift.id}`);
  };

  const calculatedTotal = durationHours * hourlyRate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post New Shift Requirement"
      description={`Creating requirement for ${hospitalUser.name} (${hospitalUser.trustName})`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profession & Specialty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Healthcare Profession
            </label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value as Profession)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical Specialty
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value as Specialty)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>
        </div>

        {/* Location & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              UK City / Region
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as UKCity)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              Department / Ward
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g. Acute Medical Unit (AMU)"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shift Day
            </label>
            <select
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="16 Oct 2026">16 Oct 2026</option>
              <option value="17 Oct 2026">17 Oct 2026</option>
              <option value="18 Oct 2026">18 Oct 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shift Hours
            </label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="17:00"
                className="w-1/2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-center"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="23:00"
                className="w-1/2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Duration (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Priority & Pay */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Urgency Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ShiftPriority)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Urgent">Urgent (Immediate Fill)</option>
              <option value="High Priority">High Priority</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hourly Rate (£/hr)
            </label>
            <input
              type="number"
              min="20"
              max="250"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Min. Experience
            </label>
            <select
              value={requiredExperienceYears}
              onChange={(e) => setRequiredExperienceYears(Number(e.target.value))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value={2}>2+ years</option>
              <option value={4}>4+ years</option>
              <option value={6}>6+ years</option>
              <option value={8}>8+ years (Consultant)</option>
            </select>
          </div>
        </div>

        {/* Total Calculated Pay strip */}
        <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-lg flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Estimated Total Remuneration:</span>
          <span className="font-bold text-slate-900 tabular-nums text-sm">
            £{calculatedTotal} <span className="font-normal text-slate-500 text-xs">({durationHours} hrs @ £{hourlyRate}/hr)</span>
          </span>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Clinical Notes & Requirements
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Special certifications, ward details, parking notes..."
          />
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" size="sm">
            Publish Requirement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
