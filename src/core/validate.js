/**
 * @file Lightweight runtime validators for inter-module data contracts.
 *       Used at system boundaries (app.js) — NOT inside pure modules.
 */

/** @typedef {import('../types.js').Drink} Drink */
/** @typedef {import('../types.js').BACParams} BACParams */

/**
 * Validate a Drink object.
 * @param {*} d - Value to check
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateDrink(d) {
  if (!d || typeof d !== 'object') return { valid: false, reason: 'not an object' };
  if (typeof d.name !== 'string' || !d.name) return { valid: false, reason: 'missing name' };
  if (typeof d.vol !== 'number' || d.vol <= 0) return { valid: false, reason: 'vol must be > 0' };
  if (typeof d.abv !== 'number' || d.abv < 0 || d.abv > 100) return { valid: false, reason: 'abv must be 0-100' };
  if (!(d.time instanceof Date) || isNaN(d.time)) return { valid: false, reason: 'invalid time' };
  return { valid: true };
}

/**
 * Validate a BACParams object.
 * @param {*} p - Value to check
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateBACParams(p) {
  if (!p || typeof p !== 'object') return { valid: false, reason: 'not an object' };
  if (typeof p.weight !== 'number' || p.weight <= 0) return { valid: false, reason: 'weight must be > 0' };
  if (typeof p.sexFactor !== 'number' || p.sexFactor <= 0) return { valid: false, reason: 'invalid sexFactor' };
  if (typeof p.elimRate !== 'number' || p.elimRate <= 0) return { valid: false, reason: 'invalid elimRate' };
  if (typeof p.limit !== 'number' || p.limit < 0) return { valid: false, reason: 'invalid limit' };
  return { valid: true };
}
