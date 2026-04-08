/**
 * @file Shared constants — Layer 0, no imports.
 *       Import directly from './constants.js', NOT through barrels.
 */

/** BAC below which a person is considered fully sober (g/L) */
export const BAC_TRACE_THRESHOLD = 0.001;

/** Blood-to-breath alcohol conversion ratio */
export const BLOOD_TO_BREATH_RATIO = 0.5;

/** Ethanol density (g/mL) */
export const ALCOHOL_DENSITY = 0.8;

/** Milliseconds in one minute */
export const MS_PER_MINUTE = 60_000;

/** Milliseconds in one hour */
export const MS_PER_HOUR = 3_600_000;

/** Maximum horizon for binary search (hours) */
export const MAX_SEARCH_HOURS = 48;

/** Default body weight when input is empty (kg) */
export const DEFAULT_WEIGHT_KG = 80;

/** Fallback legal limit for "Other" country (g/L) */
export const DEFAULT_CUSTOM_LIMIT = 0.5;

/** localStorage key for diagnostic logs */
export const LOG_STORAGE_KEY = 'drinkinator_logs';

/** Max log entries before FIFO eviction */
export const LOG_MAX_ENTRIES = 500;

/** Auto-update interval for BAC recalculation (ms) */
export const UPDATE_INTERVAL_MS = 30_000;

// --- Widmark body parameters ---

/** Male Widmark distribution factor */
export const SEX_FACTOR_MALE = 0.7;
/** Female Widmark distribution factor */
export const SEX_FACTOR_FEMALE = 0.6;
/** Male minimum elimination rate (g/L/h) */
export const ELIM_MIN_MALE = 0.10;
/** Male maximum elimination rate (g/L/h) */
export const ELIM_MAX_MALE = 0.15;
/** Female minimum elimination rate (g/L/h) */
export const ELIM_MIN_FEMALE = 0.085;
/** Female maximum elimination rate (g/L/h) */
export const ELIM_MAX_FEMALE = 0.10;

// --- Search / rendering ---

/** Binary search iteration count */
export const SEARCH_ITERATIONS = 50;
/** Timeline bar scale factor (multiples of limit) */
export const TIMELINE_DANGER_SCALE = 3;
/** Minimum divisor safeguard for timeline percentage */
export const TIMELINE_MIN_LIMIT = 0.01;
