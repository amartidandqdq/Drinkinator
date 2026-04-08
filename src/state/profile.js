/**
 * @file Reads user profile from DOM elements and returns BACParams.
 */

/** @typedef {import('../types.js').BACParams} BACParams */
/** @typedef {import('../types.js').Country} Country */

import { sexFactor, elimRate } from '../core/params.js';
import { DEFAULT_WEIGHT_KG, DEFAULT_CUSTOM_LIMIT } from '../constants.js';

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
 * @param {ProfileDOM} dom - Element references
 * @param {Country[]} countries - Country dataset
 * @returns {BACParams}
 */
export function readProfile(dom, countries) {
  const weight = parseFloat(dom.weight.value) || DEFAULT_WEIGHT_KG;
  const sex = dom.getSex();
  const tolerance = parseFloat(dom.tolerance.value);
  const country = countries[dom.country.value];

  let limit = country.limit;
  if (country.code === 'OTHER') {
    limit = parseFloat(dom.customLimit.value) || DEFAULT_CUSTOM_LIMIT;
  }

  return { weight, sexFactor: sexFactor(sex), elimRate: elimRate(sex, tolerance), limit };
}

/**
 * Map tolerance value (0..1) to a human label.
 * @param {number} value - Tolerance slider value
 * @returns {string}
 */
export function toleranceLabel(value) {
  const labels = ['Très faible', 'Faible', 'Moyenne', 'Élevée', 'Très élevée'];
  return labels[Math.min(4, Math.floor(value * 4.99))];
}
