// Purpose: Thin wrappers over date-fns functions to handle logic purely.

import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday as isDateToday,
  addMonths,
  subMonths,
} from "date-fns";

/** Returns all days to render in a given month */
export function getDaysInMonth(currentDate: Date): Date[] {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  return eachDayOfInterval({ start, end });
}

/** Formats a date to generic internal YYYY-MM-DD */
export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function formatLongDate(date: Date): string {
  return format(date, "EEEE, MMMM d, yyyy");
}

export function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth);
}

export function isToday(date: Date): boolean {
  return isDateToday(date);
}

export function isSame(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function getPrevMonth(date: Date): Date {
  return subMonths(date, 1);
}

/** Get empty cells to pad the beginning of the grid */
export function getLeadingEmptyDays(currentDate: Date): number {
  const start = startOfMonth(currentDate);
  return start.getDay(); // 0 (Sunday) to 6 (Saturday)
}
