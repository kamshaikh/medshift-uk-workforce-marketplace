export type Profession = 'Doctor' | 'Nurse' | 'Pharmacist';

export type Specialty =
  | 'Cardiology'
  | 'Dermatology'
  | 'Neurology'
  | 'Gastroenterology'
  | 'Emergency Medicine'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'General Medicine';

export type ShiftStatus =
  | 'Open'
  | 'Matching'
  | 'Matched'
  | 'Invited'
  | 'Filled'
  | 'Booked'
  | 'Cancelled'
  | 'Urgent';

export type ShiftPriority = 'Normal' | 'High' | 'Urgent' | 'High Priority';

export type UKCity =
  | 'London'
  | 'Manchester'
  | 'Birmingham'
  | 'Leeds'
  | 'Bristol'
  | 'Liverpool'
  | 'Edinburgh';

export type UserRole = 'hospital' | 'professional';

export interface ActivityItem {
  id: string;
  type: 'shift_completed' | 'profile_updated' | 'availability_updated' | 'invitation_received' | 'shift_accepted';
  title: string;
  description: string;
  timestamp: string;
}

export interface ScheduleSlot {
  id: string;
  day?: string; // 'Monday' | 'Tuesday' etc.
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "17:00"
  status: 'Working' | 'Available' | 'Unavailable';
  location?: string;
  shiftId?: string;
}

export interface HealthcareProfessional {
  id: string;
  name: string;
  title: string; // e.g. "Dr. Sarah Mitchell" or "Marcus Evans, RN"
  profession: Profession;
  specialty: Specialty;
  subSpecialty?: string;
  city: UKCity;
  hospitalAffiliation?: string;
  experienceYears: number;
  gmcOrNmcNumber: string; // GMC or NMC
  verifiedCredentials: boolean;
  dbsChecked: boolean;
  rightToWorkChecked?: boolean;
  clinicalReferencesCount?: number;
  hourlyRate: number; // £/hr
  rating: number; // e.g. 4.9
  completedShiftsCount: number;
  bio: string;
  qualifications: string[];
  languages: string[];
  avatarInitials: string;
  avatarColor: string;
  currentStatus: 'Available' | 'On Shift' | 'Resting';
  availabilityDays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  preferredShiftTypes: ('Day' | 'Twilight' | 'Night' | 'Weekend')[];
  weeklySchedule: Record<string, ScheduleSlot[]>; // Monday -> Sunday slots
  recentActivity: ActivityItem[];
  contactEmail: string;
  contactPhone: string;
}

export interface Hospital {
  id: string;
  name: string;
  trustName: string; // e.g. "Imperial College Healthcare NHS Trust"
  city: UKCity;
  address: string;
  departments: Specialty[];
  totalBeds: number;
  activeShiftsCount: number;
  contactPerson: string;
  contactRole: string;
  rating: number;
}

export interface Shift {
  id: string;
  hospitalId: string;
  hospitalName: string;
  trustName: string;
  department: string;
  profession: Profession;
  specialty: Specialty;
  city: UKCity;
  locationDetails: string; // e.g. "Ward 4B, Acute Assessment Unit"
  dateLabel: string; // e.g. "Today", "Tomorrow", "2026-10-18"
  startTime: string; // e.g. "17:00"
  endTime: string; // e.g. "23:00"
  durationHours: number;
  priority: ShiftPriority;
  status: ShiftStatus;
  hourlyRate: number; // £/hr
  totalPay: number; // duration * hourlyRate
  matchedCandidateId?: string;
  matchedCandidateName?: string;
  invitedProfessionalIds?: string[];
  filledByProfessionalId?: string;
  filledByProfessionalName?: string;
  requiredExperienceYears: number;
  notes: string;
  createdAt: string;
}

export interface MatchReason {
  label: string;
  isPositive: boolean;
  pointsAwarded: number;
  maxPoints: number;
}

export interface MatchResult {
  professional: HealthcareProfessional;
  score: number;
  reasons: string[];
  detailedReasons: MatchReason[];
  matchLevel: 'excellent' | 'strong' | 'possible' | 'weak';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type:
    | 'urgent_shift'
    | 'shift_matched'
    | 'shift_filled'
    | 'shift_accepted'
    | 'invitation_received'
    | 'shift_reminder'
    | 'availability_update'
    | 'profile_update'
    | 'compliance_reminder';
  shiftId?: string;
  professionalId?: string;
  recipientRole: UserRole | 'all';
}
