/**
 * @file Pure computation of Widmark body parameters from raw profile inputs.
 *       No DOM access — testable in isolation.
 */

/**
 * Compute the Widmark sex distribution factor.
 * @param {"male"|"female"} sex
 * @returns {number} 0.7 (male) or 0.6 (female)
 */
export function sexFactor(sex) {
  return sex === 'male' ? 0.7 : 0.6;
}

/**
 * Compute alcohol elimination rate interpolated by tolerance.
 * @param {"male"|"female"} sex
 * @param {number} tolerance - Value between 0 and 1
 * @returns {number} Elimination rate in g/L/h
 */
export function elimRate(sex, tolerance) {
  const [min, max] = sex === 'male' ? [0.10, 0.15] : [0.085, 0.10];
  return min + tolerance * (max - min);
}
