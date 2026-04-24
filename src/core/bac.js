/**
 * @file Pure BAC computation — no DOM access.
 */

/** @typedef {import('../types.js').Drink} Drink */
/** @typedef {import('../types.js').BACParams} BACParams */

import { ALCOHOL_DENSITY, MS_PER_HOUR } from '../constants.js';

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
 * Model: Widmark piecewise — elimination is an absolute rate (g/L/h) on the
 * cumulative BAC, not per-drink. Drinks are processed in chronological order;
 * between consecutive drinks we subtract elimRate * elapsed_hours from the
 * running BAC (clamped to 0). Each drink adds its peak instantly. Finally
 * elimination is applied from the last drink up to `now`.
 * @param {Drink[]} drinks - All consumed drinks (input not mutated)
 * @param {Date} now - Point in time to evaluate
 * @param {BACParams} params - Body parameters
 * @returns {number} Estimated BAC in g/L (>= 0)
 */
export function computeBAC(drinks, now, params) {
  const nowMs = now instanceof Date ? now.getTime() : now;
  const sorted = drinks
    .filter((d) => d.time.getTime() <= nowMs)
    .slice()
    .sort((a, b) => a.time.getTime() - b.time.getTime());

  let bac = 0;
  let lastMs = null;
  for (const d of sorted) {
    const tMs = d.time.getTime();
    if (lastMs !== null) {
      const elapsedH = (tMs - lastMs) / MS_PER_HOUR;
      bac = Math.max(0, bac - params.elimRate * elapsedH);
    }
    bac += drinkBAC(d, params);
    lastMs = tMs;
  }
  if (lastMs !== null) {
    const tailH = (nowMs - lastMs) / MS_PER_HOUR;
    bac = Math.max(0, bac - params.elimRate * tailH);
  }
  return Math.max(0, bac);
}
