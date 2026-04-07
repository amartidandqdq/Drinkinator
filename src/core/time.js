/**
 * @file Time-related helpers — finding future BAC thresholds + formatting.
 */

/** @typedef {import('../types.js').Drink} Drink */
/** @typedef {import('../types.js').BACParams} BACParams */

/**
 * Find minutes from `now` until BAC drops to `target` via binary search.
 * @param {number} target - Target BAC in g/L
 * @param {Drink[]} drinks - All consumed drinks
 * @param {Date} now - Current time
 * @param {BACParams} params - Body parameters
 * @param {(drinks: Drink[], now: Date, params: BACParams) => number} computeBAC - BAC calculator
 * @returns {number} Minutes from now until BAC <= target
 */
export function findTimeTo(target, drinks, now, params, computeBAC) {
  let lo = 0;
  let hi = 48 * 60;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const futureBAC = computeBAC(drinks, new Date(now.getTime() + mid * 60_000), params);
    if (futureBAC > target) lo = mid;
    else hi = mid;
  }
  return hi;
}

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
  return `${h}h ${m}min`;
}
