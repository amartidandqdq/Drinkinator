/**
 * @file Reads user profile from DOM elements and returns BACParams.
 */

/** @typedef {import('../types.js').BACParams} BACParams */
/** @typedef {import('../types.js').Country} Country */

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
  const weight = parseFloat(dom.weight.value) || 80;
  const sex = dom.getSex();
  const tolerance = parseFloat(dom.tolerance.value);
  const country = countries[dom.country.value];

  const sexFactor = sex === 'male' ? 0.7 : 0.6;

  /** Elimination rate: interpolate between min/max by tolerance slider */
  const [elimMin, elimMax] = sex === 'male' ? [0.10, 0.15] : [0.085, 0.10];
  const elimRate = elimMin + tolerance * (elimMax - elimMin);

  let limit = country.limit;
  if (country.code === 'OTHER') {
    limit = parseFloat(dom.customLimit.value) || 0.5;
  }

  return { weight, sexFactor, elimRate, limit };
}

/**
 * Map tolerance value (0..1) to a human label.
 * @param {number} value - Tolerance slider value
 * @returns {string}
 */
export function toleranceLabel(value) {
  const labels = ['Very low', 'Low', 'Medium', 'High', 'Very high'];
  return labels[Math.min(4, Math.floor(value * 4.99))];
}
