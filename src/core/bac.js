/**
 * @file Pure BAC computation — no DOM access.
 */

/** @typedef {import('../types.js').Drink} Drink */
/** @typedef {import('../types.js').BACParams} BACParams */

/** Alcohol density in g/mL */
const ALCOHOL_DENSITY = 0.8;

/**
 * Compute peak BAC contribution of a single drink.
 * @param {Drink} drink - The consumed drink
 * @param {BACParams} params - Body parameters
 * @returns {number} Peak BAC in g/L
 */
export function drinkBAC(drink, params) {
  return (drink.vol * (drink.abv / 100) * ALCOHOL_DENSITY) /
    (params.sexFactor * params.weight);
}

/**
 * Compute total BAC at a given point in time.
 * Model: each drink adds an instant peak, then decreases linearly.
 * @param {Drink[]} drinks - All consumed drinks
 * @param {Date} now - Point in time to evaluate
 * @param {BACParams} params - Body parameters
 * @returns {number} Estimated BAC in g/L (>= 0)
 */
export function computeBAC(drinks, now, params) {
  let bac = 0;
  for (const d of drinks) {
    const hoursElapsed = (now - d.time) / 3_600_000;
    if (hoursElapsed < 0) continue;
    const peak = drinkBAC(d, params);
    const remaining = peak - params.elimRate * hoursElapsed;
    if (remaining > 0) bac += remaining;
  }
  return Math.max(0, bac);
}
