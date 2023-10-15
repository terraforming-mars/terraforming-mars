/**
 * Adds `days` days to `date`. `days can be negative.
 * @param date a valid date
 * @param days a number of days
 * @returns date + days (in days)
 */
export function addDays(date: Date, days: number) {
  const ms = Math.round(date.getTime());
  const daysInMs = days * 86400 * 1000;
  return new Date(ms + daysInMs);
}

export function dateToSeconds(date: Date) {
  return Math.round(date.getTime() / 1000);
}

export function dayStringToDays(dayString: string | undefined, defaultValue: number): number {
  const parsed = parseInt(dayString || '');
  return Number.isInteger(parsed) ? parsed : defaultValue;
}

export function daysAgoToSeconds(dayString: string | undefined, defaultValue: number): number {
  const days = dayStringToDays(dayString, defaultValue);
  const date = addDays(new Date(), -days);
  return dateToSeconds(date);
}
