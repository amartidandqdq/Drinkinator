/**
 * @file Shared type definitions for Drinkinator.
 * Import this file for JSDoc type references only — no runtime code.
 */

/**
 * @typedef {Object} Country
 * @property {string} code - ISO 3166-1 alpha-2 code or "OTHER"
 * @property {string} name - Display name
 * @property {string} flag - Flag emoji
 * @property {number} limit - Legal BAC limit in g/L
 * @property {number|null} young - Young driver limit (null = not applicable)
 * @property {number|null} pro - Professional driver limit (null = not applicable)
 */

/**
 * @typedef {Object} Preset
 * @property {string} name - Drink display name
 * @property {number} vol - Default volume in mL
 * @property {number} abv - Alcohol by volume in percent
 * @property {string} icon - Emoji icon
 */

/**
 * @typedef {Object} Drink
 * @property {string} name - Drink label
 * @property {number} vol - Volume consumed in mL
 * @property {number} abv - ABV in percent
 * @property {Date} time - When the drink was consumed
 */

/**
 * @typedef {Object} BACParams
 * @property {number} weight - Body weight in kg
 * @property {number} sexFactor - Widmark distribution factor (0.7 male, 0.6 female)
 * @property {number} elimRate - Alcohol elimination rate in g/L/h
 * @property {number} limit - Legal BAC limit in g/L
 */

/**
 * @typedef {Object} LogEntry
 * @property {string} timestamp - ISO 8601
 * @property {string} traceId - Session-unique UUID for correlation
 * @property {"error"|"warn"|"info"|"debug"} level
 * @property {string} source - Module tag (e.g. 'bac', 'ui', 'profile')
 * @property {string} message
 * @property {*} payload - Serialized input data, or null
 * @property {string|null} stack - Error.stack, or null
 */

export {};
