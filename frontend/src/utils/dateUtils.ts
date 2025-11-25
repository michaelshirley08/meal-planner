import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const weekStart = startOfWeek(d, { weekStartsOn: 1 }); // Monday
  return format(weekStart, 'yyyy-MM-dd');
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const weekEnd = endOfWeek(d, { weekStartsOn: 1 }); // Sunday
  return format(weekEnd, 'yyyy-MM-dd');
}

/**
 * Get an array of 7 dates for the week starting from Monday
 */
export function getWeekDates(startDate: string): string[] {
  const start = parseISO(startDate);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    return format(date, 'yyyy-MM-dd');
  });
}

/**
 * Get the next week's start date
 */
export function getNextWeek(currentWeekStart: string): string {
  const date = parseISO(currentWeekStart);
  const nextWeek = addWeeks(date, 1);
  return format(nextWeek, 'yyyy-MM-dd');
}

/**
 * Get the previous week's start date
 */
export function getPreviousWeek(currentWeekStart: string): string {
  const date = parseISO(currentWeekStart);
  const prevWeek = subWeeks(date, 1);
  return format(prevWeek, 'yyyy-MM-dd');
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Check if a date is today
 */
export function isToday(date: string): boolean {
  return isSameDay(parseISO(date), new Date());
}

/**
 * Format date for display (e.g., "Mon, Nov 25")
 */
export function formatDisplayDate(date: string): string {
  return format(parseISO(date), 'EEE, MMM d');
}

/**
 * Format date for display with year (e.g., "Nov 25, 2025")
 */
export function formatFullDate(date: string): string {
  return format(parseISO(date), 'MMM d, yyyy');
}

/**
 * Get day of week name (e.g., "Monday")
 */
export function getDayName(date: string): string {
  return format(parseISO(date), 'EEEE');
}

/**
 * Get short day of week name (e.g., "Mon")
 */
export function getShortDayName(date: string): string {
  return format(parseISO(date), 'EEE');
}

/**
 * Get the current week start (this week's Monday)
 */
export function getCurrentWeekStart(): string {
  return getWeekStart(new Date());
}

/**
 * Check if a date is in the past
 */
export function isPast(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = parseISO(date);
  return checkDate < today;
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = parseISO(date);
  return checkDate > today;
}

/**
 * Get meal type display name
 */
export function getMealTypeDisplay(mealType: MealType): string {
  const displayMap: Record<MealType, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  };
  return displayMap[mealType];
}

/**
 * Get meal type order for sorting
 */
export function getMealTypeOrder(mealType: MealType): number {
  const orderMap: Record<MealType, number> = {
    breakfast: 0,
    lunch: 1,
    dinner: 2,
    snack: 3,
  };
  return orderMap[mealType];
}

/**
 * Get all meal types in order
 */
export function getAllMealTypes(): MealType[] {
  return ['breakfast', 'lunch', 'dinner', 'snack'];
}
