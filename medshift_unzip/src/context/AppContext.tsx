import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Shift,
  HealthcareProfessional,
  Hospital,
  ScheduleSlot,
  AppNotification,
} from '../types';
import { INITIAL_SHIFTS } from '../data/shifts';
import { MOCK_PROFESSIONALS, CURRENT_PROFESSIONAL_USER } from '../data/professionals';
import { MOCK_HOSPITALS } from '../data/hospitals';
import { INITIAL_NOTIFICATIONS } from '../data/notifications';
import { safeStorage, STORAGE_KEYS } from '../utils/storage';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  hospitalUser: Hospital;
  professionalUser: HealthcareProfessional;
  shifts: Shift[];
  professionals: HealthcareProfessional[];
  hospitals: Hospital[];
  notifications: AppNotification[];
  scheduleSlots: ScheduleSlot[];
  savedShiftIds: string[];
  favoriteProfessionalIds: string[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleFavoriteProfessional: (professionalId: string) => boolean;
  postNewShift: (shiftData: Omit<Shift, 'id' | 'createdAt' | 'status' | 'totalPay'>) => Shift;
  matchShift: (shiftId: string, professionalId: string, professionalName: string) => void;
  inviteProfessionalToShift: (shiftId: string, professionalId: string, customNote?: string) => void;
  acceptShiftByProfessional: (shiftId: string) => void;
  toggleSaveShift: (shiftId: string) => boolean; // returns true if now saved, false if removed
  fillShiftDirectly: (shiftId: string, professionalId: string, professionalName: string) => void;
  toggleScheduleAvailability: (slotId: string) => void;
  updateWeeklySchedule: (newSchedule: Record<string, ScheduleSlot[]>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id'>) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SCHEDULE_SLOTS: ScheduleSlot[] = [
  {
    id: 'slot-1',
    startTime: '09:00',
    endTime: '17:00',
    status: 'Working',
    location: "St Mary's Hospital (Dermatology Day Clinic)",
  },
  {
    id: 'slot-2',
    startTime: '17:00',
    endTime: '23:00',
    status: 'Available',
    location: 'Open for Locum / On-Call',
  },
  {
    id: 'slot-3',
    startTime: '23:00',
    endTime: '08:00',
    status: 'Unavailable',
    location: 'Mandatory Rest Period',
  },
];

/**
 * Deduplicates shift records:
 * 1. Guarantees uniqueness by shift ID.
 * 2. Prunes any duplicate submissions created in rapid succession with identical clinical details.
 */
export function deduplicateShifts(rawShifts: Shift[]): Shift[] {
  if (!Array.isArray(rawShifts)) return [];
  const seenIds = new Set<string>();
  const seenFingerprints = new Map<string, number>();
  const cleanList: Shift[] = [];

  for (const shift of rawShifts) {
    if (!shift || typeof shift.id !== 'string') continue;

    // 1. Check ID uniqueness
    if (seenIds.has(shift.id)) {
      continue;
    }

    // 2. Check clinical fingerprint to prevent rapid duplicate creation
    const fingerprint = `${shift.hospitalId || shift.hospitalName}_${shift.specialty}_${shift.profession}_${shift.dateLabel}_${shift.startTime}_${shift.endTime}_${shift.department}_${shift.hourlyRate}`;
    const createdAtTime = shift.createdAt ? new Date(shift.createdAt).getTime() : 0;

    if (seenFingerprints.has(fingerprint)) {
      const prevTime = seenFingerprints.get(fingerprint)!;
      // If created within 20 seconds with identical parameters, treat as duplicate submission
      if (Math.abs(createdAtTime - prevTime) < 20000) {
        continue;
      }
    }

    seenIds.add(shift.id);
    if (createdAtTime > 0) {
      seenFingerprints.set(fingerprint, createdAtTime);
    }

    cleanList.push({
      ...shift,
      invitedProfessionalIds: Array.isArray(shift.invitedProfessionalIds)
        ? Array.from(new Set(shift.invitedProfessionalIds))
        : [],
    });
  }

  return cleanList;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme State (System default with manual override persisted via safeStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.THEME) : null;
    if (saved === 'light' || saved === 'dark') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Role State
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = safeStorage.get<string>(STORAGE_KEYS.ROLE, 'hospital');
    return (saved as UserRole) || 'hospital';
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    safeStorage.set(STORAGE_KEYS.ROLE, newRole);
  };

  // 3. Shifts State
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = safeStorage.get<Shift[]>(STORAGE_KEYS.SHIFTS, []);
    if (Array.isArray(saved) && saved.length > 0) {
      const cleanSaved = deduplicateShifts(saved);
      const existingIds = new Set(cleanSaved.map((s) => s.id));
      const merged = [
        ...cleanSaved,
        ...INITIAL_SHIFTS.filter((s) => !existingIds.has(s.id)),
      ];
      return deduplicateShifts(merged);
    }
    return INITIAL_SHIFTS;
  });

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.SHIFTS, shifts);
  }, [shifts]);

  // 4. Professional User State
  const [professionalUser, setProfessionalUser] = useState<HealthcareProfessional>(() => {
    const saved = safeStorage.get<Partial<HealthcareProfessional>>(STORAGE_KEYS.PROF_USER, {});
    return {
      ...CURRENT_PROFESSIONAL_USER,
      ...saved,
      qualifications: saved.qualifications || CURRENT_PROFESSIONAL_USER.qualifications,
      languages: saved.languages || CURRENT_PROFESSIONAL_USER.languages,
      weeklySchedule: saved.weeklySchedule || CURRENT_PROFESSIONAL_USER.weeklySchedule,
      recentActivity: saved.recentActivity || CURRENT_PROFESSIONAL_USER.recentActivity,
    };
  });

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.PROF_USER, professionalUser);
  }, [professionalUser]);

  // 5. Professionals List State (Synchronized with professionalUser)
  const [professionals, setProfessionals] = useState<HealthcareProfessional[]>(() => {
    return MOCK_PROFESSIONALS.map((p) =>
      p.id === professionalUser.id ? { ...p, currentStatus: professionalUser.currentStatus } : p
    );
  });

  // Keep professionals list in sync whenever professionalUser changes
  useEffect(() => {
    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === professionalUser.id ? { ...p, ...professionalUser } : p
      )
    );
  }, [professionalUser]);

  // 6. Professional Saved Shifts
  const [savedShiftIds, setSavedShiftIds] = useState<string[]>(() => {
    return safeStorage.get<string[]>(STORAGE_KEYS.SAVED_SHIFTS, []);
  });

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.SAVED_SHIFTS, savedShiftIds);
  }, [savedShiftIds]);

  // 7. Hospital Favorite Professionals
  const [favoriteProfessionalIds, setFavoriteProfessionalIds] = useState<string[]>(() => {
    return safeStorage.get<string[]>(STORAGE_KEYS.FAVORITE_PROFS, []);
  });

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.FAVORITE_PROFS, favoriteProfessionalIds);
  }, [favoriteProfessionalIds]);

  const toggleFavoriteProfessional = (professionalId: string): boolean => {
    let isNowFavorite = false;
    setFavoriteProfessionalIds((prev) => {
      if (prev.includes(professionalId)) {
        isNowFavorite = false;
        return prev.filter((id) => id !== professionalId);
      } else {
        isNowFavorite = true;
        return Array.from(new Set([...prev, professionalId]));
      }
    });
    return isNowFavorite;
  };

  // 8. Schedule Slots State
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>(() => {
    const saved = safeStorage.get<ScheduleSlot[]>(STORAGE_KEYS.SCHEDULE_SLOTS, []);
    return Array.isArray(saved) && saved.length > 0 ? saved : INITIAL_SCHEDULE_SLOTS;
  });

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.SCHEDULE_SLOTS, scheduleSlots);
  }, [scheduleSlots]);

  // 9. Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = safeStorage.get<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return Array.isArray(saved) && saved.length > 0 ? saved : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  const addNotification = (notif: Omit<AppNotification, 'id'>) => {
    const newEntry: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setNotifications((prev) => [newEntry, ...prev]);
  };

  // Actions
  const postNewShift = (shiftData: Omit<Shift, 'id' | 'createdAt' | 'status' | 'totalPay'>): Shift => {
    const totalPay = shiftData.durationHours * shiftData.hourlyRate;
    const nowTime = Date.now();
    const nowIso = new Date().toISOString();

    // Check if an identical shift was created in the last 15 seconds
    const existingRecent = shifts.find(
      (s) =>
        (s.hospitalId === shiftData.hospitalId || s.hospitalName === shiftData.hospitalName) &&
        s.specialty === shiftData.specialty &&
        s.profession === shiftData.profession &&
        s.dateLabel === shiftData.dateLabel &&
        s.startTime === shiftData.startTime &&
        s.endTime === shiftData.endTime &&
        s.department === shiftData.department &&
        s.hourlyRate === shiftData.hourlyRate &&
        Math.abs(nowTime - new Date(s.createdAt).getTime()) < 15000
    );

    if (existingRecent) {
      // Return existing single record without creating a duplicate
      return existingRecent;
    }

    const uniqueSuffix = Math.random().toString(36).substring(2, 8);
    const newShift: Shift = {
      ...shiftData,
      id: `shift-${nowTime}-${uniqueSuffix}`,
      createdAt: nowIso,
      status: shiftData.priority === 'Urgent' ? 'Urgent' : 'Open',
      totalPay,
      invitedProfessionalIds: [],
    };

    setShifts((prev) => deduplicateShifts([newShift, ...prev]));

    // Add notification alert
    addNotification({
      title: 'New Shift Requirement Created',
      message: `${shiftData.specialty} ${shiftData.profession} shift published for ${shiftData.dateLabel} (${shiftData.startTime} - ${shiftData.endTime}) at ${shiftData.hospitalName}.`,
      timestamp: 'Just now',
      read: false,
      type: 'urgent_shift',
      shiftId: newShift.id,
      recipientRole: 'all',
    });

    return newShift;
  };

  const matchShift = (shiftId: string, professionalId: string, professionalName: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              status: 'Matching',
              matchedCandidateId: professionalId,
              matchedCandidateName: professionalName,
            }
          : s
      )
    );

    addNotification({
      title: 'New Shift Match Found',
      message: `${professionalName} has been matched with a shift requirement.`,
      timestamp: 'Just now',
      read: false,
      type: 'shift_matched',
      shiftId,
      professionalId,
      recipientRole: 'all',
    });
  };

  const inviteProfessionalToShift = (shiftId: string, professionalId: string, customNote?: string) => {
    const prof = professionals.find((p) => p.id === professionalId) || CURRENT_PROFESSIONAL_USER;
    const targetShift = shifts.find((s) => s.id === shiftId);

    if (!targetShift) return;

    // Prevent duplicate invitation
    if (targetShift.invitedProfessionalIds?.includes(professionalId)) {
      return;
    }

    setShifts((prev) =>
      deduplicateShifts(
        prev.map((s) => {
          if (s.id !== shiftId) return s;
          const prevList = s.invitedProfessionalIds || [];
          const nextList = prevList.includes(professionalId) ? prevList : [...prevList, professionalId];
          return {
            ...s,
            status: 'Invited',
            invitedProfessionalIds: nextList,
            matchedCandidateId: professionalId,
            matchedCandidateName: prof.name,
          };
        })
      )
    );

    // Create notification for professional and hospital
    const hospitalName = targetShift ? targetShift.hospitalName : "St Mary's Hospital";
    const specialty = targetShift ? targetShift.specialty : 'Clinical';
    const rate = targetShift ? targetShift.hourlyRate : 85;
    const dateLabel = targetShift ? targetShift.dateLabel : 'Upcoming';

    addNotification({
      title: 'Hospital Shift Invitation',
      message: `${hospitalName} invited ${prof.name} for ${specialty} shift (${dateLabel}, £${rate}/hr)${customNote ? `: "${customNote}"` : '.'} (Simulated Invitation)`,
      timestamp: 'Just now',
      read: false,
      type: 'invitation_received',
      shiftId,
      professionalId,
      recipientRole: 'all',
    });
  };

  const acceptShiftByProfessional = (shiftId: string) => {
    const targetShift = shifts.find((s) => s.id === shiftId);

    // 1. Shift status updates to Filled
    setShifts((prev) =>
      deduplicateShifts(
        prev.map((s) =>
          s.id === shiftId
            ? {
                ...s,
                status: 'Filled',
                filledByProfessionalId: CURRENT_PROFESSIONAL_USER.id,
                filledByProfessionalName: CURRENT_PROFESSIONAL_USER.name,
              }
            : s
        )
      )
    );

    // 2. Professional status updates to On Shift, and completed shifts count increases
    setProfessionalUser((prev) => ({
      ...prev,
      currentStatus: 'On Shift',
      completedShiftsCount: (prev.completedShiftsCount || 0) + 1,
    }));

    // 3. Hospital and Professional receive immediate notification
    addNotification({
      title: 'Shift Accepted & Confirmed',
      message: `${CURRENT_PROFESSIONAL_USER.name} accepted ${targetShift?.specialty || 'specialist'} shift at ${targetShift?.hospitalName || "St Mary's Hospital"}. Timesheet rota locked.`,
      timestamp: 'Just now',
      read: false,
      type: 'shift_accepted',
      shiftId,
      recipientRole: 'all',
    });
  };

  const toggleSaveShift = (shiftId: string): boolean => {
    let isSaved = false;
    setSavedShiftIds((prev) => {
      if (prev.includes(shiftId)) {
        isSaved = false;
        return prev.filter((id) => id !== shiftId);
      } else {
        isSaved = true;
        return Array.from(new Set([...prev, shiftId]));
      }
    });
    return isSaved;
  };

  const fillShiftDirectly = (shiftId: string, professionalId: string, professionalName: string) => {
    setShifts((prev) =>
      deduplicateShifts(
        prev.map((s) =>
          s.id === shiftId
            ? {
                ...s,
                status: 'Filled',
                filledByProfessionalId: professionalId,
                filledByProfessionalName: professionalName,
              }
            : s
        )
      )
    );
  };

  const toggleScheduleAvailability = (slotId: string) => {
    setScheduleSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          const nextStatus = slot.status === 'Available' ? 'Unavailable' : 'Available';
          return {
            ...slot,
            status: nextStatus,
            location: nextStatus === 'Available' ? 'Open for Locum / On-Call' : 'Unavailable (Off Duty)',
          };
        }
        return slot;
      })
    );

    addNotification({
      title: 'Availability Update',
      message: 'Clinician weekly availability updated in local rota.',
      timestamp: 'Just now',
      read: false,
      type: 'availability_update',
      recipientRole: 'professional',
    });
  };

  const updateWeeklySchedule = (newSchedule: Record<string, ScheduleSlot[]>) => {
    setProfessionalUser((prev) => ({
      ...prev,
      weeklySchedule: newSchedule,
    }));

    addNotification({
      title: 'Availability Schedule Synced',
      message: 'Weekly rota schedule has been refreshed and synchronized with candidate matching.',
      timestamp: 'Just now',
      read: false,
      type: 'availability_update',
      recipientRole: 'professional',
    });
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToDefaults = () => {
    safeStorage.clearAllMedShiftData();
    setShifts(INITIAL_SHIFTS);
    setScheduleSlots(INITIAL_SCHEDULE_SLOTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProfessionalUser(CURRENT_PROFESSIONAL_USER);
    setProfessionals(MOCK_PROFESSIONALS);
    setSavedShiftIds([]);
    setFavoriteProfessionalIds([]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        hospitalUser: MOCK_HOSPITALS[0], // St Mary's Hospital
        professionalUser,
        shifts,
        professionals,
        hospitals: MOCK_HOSPITALS,
        notifications,
        scheduleSlots,
        savedShiftIds,
        favoriteProfessionalIds,
        theme,
        toggleTheme,
        toggleFavoriteProfessional,
        postNewShift,
        matchShift,
        inviteProfessionalToShift,
        acceptShiftByProfessional,
        toggleSaveShift,
        fillShiftDirectly,
        toggleScheduleAvailability,
        updateWeeklySchedule,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
