export function dayDiff(now: Date, days: number) {
  const ms = Math.round(now.getTime());
  const daysInMs = days * 86400 * 1000;
  return new Date(ms + daysInMs);
}

export function dateToSeconds(date: Date) {
  return Math.round(date.getTime() / 1000);
}

export function daysAgoToSeconds(dayString: string | undefined, defaultValue: number) {
  const envDays = parseInt(dayString || '');
  const days = Number.isInteger(envDays) ? envDays : defaultValue;
  const date = dayDiff(new Date(), -days);
  return dateToSeconds(date);
}
