/**
 * @file Time formatting helpers — pure functions, no dependencies.
 */

/**
 * Format a future time as HH:MM.
 * @param {number} minutesFromNow - Offset in minutes
 * @param {Date} now - Reference time
 * @returns {string} "HH:MM"
 */
export function fmtTime(minutesFromNow, now) {
  const t = new Date(now.getTime() + minutesFromNow * 60_000);
  return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
}

/**
 * Format a duration in minutes as human-readable.
 * @param {number} mins - Duration in minutes
 * @returns {string} e.g. "45 min" or "2h 15min"
 */
export function fmtDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m} min`;
  return `${h} h ${String(m).padStart(2, '0')}`;
}
