/**
 * @file Binary-search algorithm to find when BAC reaches a target threshold.
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
