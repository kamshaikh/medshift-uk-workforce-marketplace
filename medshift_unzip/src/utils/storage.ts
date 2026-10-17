/**
 * Safe localStorage helper utility for MedShift prototype.
 * Guarantees crash-free parsing, default value fallbacks, and resilient serialization.
 */

export const STORAGE_KEYS = {
  THEME: 'medshift_theme',
  ROLE: 'medshift_role',
  SHIFTS: 'medshift_shifts',
  PROF_USER: 'medshift_prof_user',
  SAVED_SHIFTS: 'medshift_saved_shifts',
  FAVORITE_PROFS: 'medshift_favorite_profs',
  SCHEDULE_SLOTS: 'medshift_schedule_slots',
  NOTIFICATIONS: 'medshift_notifications',
} as const;

export const safeStorage = {
  /**
   * Safely retrieve and parse a value from localStorage.
   * If the key doesn't exist or parsing fails, returns the provided fallback.
   */
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;

      const parsed = JSON.parse(item);

      // If fallback is an array, ensure parsed value is also an array
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        return fallback;
      }

      return parsed as T;
    } catch {
      return fallback;
    }
  },

  /**
   * Safely serialize and store a value in localStorage.
   */
  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Safely remove an item from localStorage.
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore removal failure
    }
  },

  /**
   * Reset all MedShift prototype localStorage entries.
   */
  clearAllMedShiftData(): void {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        window.localStorage.removeItem(key);
      });
    } catch {
      // Ignore failure
    }
  },
};
