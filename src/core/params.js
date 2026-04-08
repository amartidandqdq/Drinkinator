/**
 * @file Pure computation of Widmark body parameters from raw profile inputs.
 *       No DOM access — testable in isolation.
 */

import {
  SEX_FACTOR_MALE, SEX_FACTOR_FEMALE,
  ELIM_MIN_MALE, ELIM_MAX_MALE,
  ELIM_MIN_FEMALE, ELIM_MAX_FEMALE,
} from '../constants.js';

/**
 * Compute the Widmark sex distribution factor.
 * @param {"male"|"female"} sex
 * @returns {number}
 */
export function sexFactor(sex) {
  return sex === 'male' ? SEX_FACTOR_MALE : SEX_FACTOR_FEMALE;
}

/**
 * Compute alcohol elimination rate interpolated by tolerance.
 * @param {"male"|"female"} sex
 * @param {number} tolerance - Value between 0 and 1
 * @returns {number} Elimination rate in g/L/h
 */
export function elimRate(sex, tolerance) {
  const [min, max] = sex === 'male'
    ? [ELIM_MIN_MALE, ELIM_MAX_MALE]
    : [ELIM_MIN_FEMALE, ELIM_MAX_FEMALE];
  return min + tolerance * (max - min);
}
