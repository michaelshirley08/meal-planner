import { describe, it, expect } from 'vitest';
import {
  getWeekStart,
  getWeekEnd,
  getWeekDates,
  getNextWeek,
  getPreviousWeek,
  getTodayString,
  isToday,
  formatDisplayDate,
  formatFullDate,
  getDayName,
  getShortDayName,
  isPast,
  isFuture,
  getMealTypeDisplay,
  getMealTypeOrder,
  getAllMealTypes,
} from './dateUtils';

describe('dateUtils', () => {
  describe('getWeekStart', () => {
    it('should return Monday for a Tuesday date', () => {
      const result = getWeekStart('2025-11-25'); // Tuesday
      expect(result).toBe('2025-11-24'); // Monday
    });

    it('should return the same date if already Monday', () => {
      const result = getWeekStart('2025-11-24'); // Monday
      expect(result).toBe('2025-11-24');
    });

    it('should return previous Monday for a Sunday', () => {
      const result = getWeekStart('2025-11-30'); // Sunday
      expect(result).toBe('2025-11-24'); // Monday
    });
  });

  describe('getWeekEnd', () => {
    it('should return Sunday for a Tuesday date', () => {
      const result = getWeekEnd('2025-11-25'); // Tuesday
      expect(result).toBe('2025-11-30'); // Sunday
    });

    it('should return the same date if already Sunday', () => {
      const result = getWeekEnd('2025-11-30'); // Sunday
      expect(result).toBe('2025-11-30');
    });
  });

  describe('getWeekDates', () => {
    it('should return 7 dates starting from Monday', () => {
      const result = getWeekDates('2025-11-24'); // Monday
      expect(result).toHaveLength(7);
      expect(result[0]).toBe('2025-11-24'); // Monday
      expect(result[6]).toBe('2025-11-30'); // Sunday
    });

    it('should return consecutive dates', () => {
      const result = getWeekDates('2025-11-24');
      for (let i = 0; i < result.length - 1; i++) {
        const current = new Date(result[i]);
        const next = new Date(result[i + 1]);
        const diff = (next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
        expect(diff).toBe(1);
      }
    });
  });

  describe('getNextWeek', () => {
    it('should return next Monday', () => {
      const result = getNextWeek('2025-11-24'); // Monday
      expect(result).toBe('2025-12-01'); // Next Monday
    });
  });

  describe('getPreviousWeek', () => {
    it('should return previous Monday', () => {
      const result = getPreviousWeek('2025-11-24'); // Monday
      expect(result).toBe('2025-11-17'); // Previous Monday
    });
  });

  describe('getTodayString', () => {
    it('should return a date in YYYY-MM-DD format', () => {
      const result = getTodayString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = getTodayString();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      expect(isToday('2020-01-01')).toBe(false);
    });
  });

  describe('formatDisplayDate', () => {
    it('should format date as "EEE, MMM d"', () => {
      const result = formatDisplayDate('2025-11-25');
      expect(result).toBe('Tue, Nov 25');
    });
  });

  describe('formatFullDate', () => {
    it('should format date as "MMM d, yyyy"', () => {
      const result = formatFullDate('2025-11-25');
      expect(result).toBe('Nov 25, 2025');
    });
  });

  describe('getDayName', () => {
    it('should return full day name', () => {
      expect(getDayName('2025-11-24')).toBe('Monday');
      expect(getDayName('2025-11-25')).toBe('Tuesday');
      expect(getDayName('2025-11-30')).toBe('Sunday');
    });
  });

  describe('getShortDayName', () => {
    it('should return short day name', () => {
      expect(getShortDayName('2025-11-24')).toBe('Mon');
      expect(getShortDayName('2025-11-25')).toBe('Tue');
      expect(getShortDayName('2025-11-30')).toBe('Sun');
    });
  });

  describe('isPast', () => {
    it('should return true for dates in the past', () => {
      expect(isPast('2020-01-01')).toBe(true);
    });

    it('should return false for future dates', () => {
      expect(isPast('2099-12-31')).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('should return true for dates in the future', () => {
      expect(isFuture('2099-12-31')).toBe(true);
    });

    it('should return false for past dates', () => {
      expect(isFuture('2020-01-01')).toBe(false);
    });
  });

  describe('getMealTypeDisplay', () => {
    it('should return capitalized meal type', () => {
      expect(getMealTypeDisplay('breakfast')).toBe('Breakfast');
      expect(getMealTypeDisplay('lunch')).toBe('Lunch');
      expect(getMealTypeDisplay('dinner')).toBe('Dinner');
      expect(getMealTypeDisplay('snack')).toBe('Snack');
    });
  });

  describe('getMealTypeOrder', () => {
    it('should return correct order', () => {
      expect(getMealTypeOrder('breakfast')).toBe(0);
      expect(getMealTypeOrder('lunch')).toBe(1);
      expect(getMealTypeOrder('dinner')).toBe(2);
      expect(getMealTypeOrder('snack')).toBe(3);
    });
  });

  describe('getAllMealTypes', () => {
    it('should return all meal types in order', () => {
      const result = getAllMealTypes();
      expect(result).toEqual(['breakfast', 'lunch', 'dinner', 'snack']);
    });
  });
});
