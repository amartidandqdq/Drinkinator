/**
 * @file Reads user profile from DOM elements and returns BACParams.
 */

/** @typedef {import('../types.js').BACParams} BACParams */
/** @typedef {import('../types.js').Country} Country */

import { sexFactor, elimRate } from '../core/params.js';
import {
  DEFAULT_WEIGHT_KG,
  DEFAULT_CUSTOM_LIMIT,
  TOLERANCE_LABELS,
} from '../constants.js';

/**
 * @typedef {Object} ProfileDOM
 * @property {HTMLInputElement} weight - Weight input
 * @property {HTMLInputElement} tolerance - Tolerance range slider
 * @property {HTMLSelectElement} country - Country select
 * @property {HTMLInputElement} customLimit - Custom limit input
 * @property {() => string} getSex - Returns "male" or "female"
 */

/**
 * Read profile from DOM elements and compute BAC parameters.
 * Returns null when the selected country index is invalid (out of range or NaN).
 * @param {ProfileDOM} dom - Element references
 * @param {Country[]} countries - Country dataset
 * @returns {BACParams | null}
 */
export function readProfile(dom, countries) {
  const idx = Number(dom.country.value);
  if (Number.isNaN(idx) || idx < 0 || idx >= countries.length) return null;

  const weight = parseFloat(dom.weight.value) || DEFAULT_WEIGHT_KG;
  const sex = dom.getSex();
  const tolerance = parseFloat(dom.tolerance.value);
  const country = countries[idx];

  let limit = country.limit;
  if (country.code === 'OTHER') {
    limit = parseFloat(dom.customLimit.value) || DEFAULT_CUSTOM_LIMIT;
  }

  return { weight, sexFactor: sexFactor(sex), elimRate: elimRate(sex, tolerance), limit };
}

/**
 * Map tolerance value (0..1) to a human label.
 * Clamps defensively when value is outside [0, 1].
 * @param {number} value - Tolerance slider value
 * @returns {string}
 */
export function toleranceLabel(value) {
  const idx = Math.max(
    0,
    Math.min(TOLERANCE_LABELS.length - 1, Math.floor(value * TOLERANCE_LABELS.length)),
  );
  return TOLERANCE_LABELS[idx];
}
