/**
 * @file Diagnostic logger — localStorage + console.
 *       Persists structured logs for post-mortem debugging.
 *       Each session gets a unique traceId for log correlation.
 */

/** @typedef {import('../types.js').LogEntry} LogEntry */

import { LOG_STORAGE_KEY, LOG_MAX_ENTRIES } from '../constants.js';

/** Session-unique trace ID for correlating logs */
const traceId = crypto.randomUUID();

/**
 * Safely serialize a payload for storage.
 * @param {*} payload
 * @returns {*}
 */
function safeSerialize(payload) {
  if (payload == null) return null;
  try {
    return JSON.parse(JSON.stringify(payload, (_k, v) =>
      v instanceof Date ? v.toISOString() : v
    ));
  } catch {
    return String(payload);
  }
}

/**
 * Persist a log entry to localStorage (FIFO eviction).
 * Silently swallows errors (private browsing, quota exceeded).
 * @param {LogEntry} entry
 */
function persist(entry) {
  try {
    let entries = [];
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    if (raw) {
      try { entries = JSON.parse(raw); } catch { entries = []; }
    }
    entries.push(entry);
    if (entries.length > LOG_MAX_ENTRIES) {
      entries = entries.slice(entries.length - LOG_MAX_ENTRIES);
    }
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(entries));
  } catch { /* private browsing or quota — console output already fired */ }
}

/**
 * Build a log entry object.
 * @param {"error"|"warn"|"info"|"debug"} level
 * @param {string} source
 * @param {string} message
 * @param {*} [payload]
 * @param {Error} [error]
 * @returns {LogEntry}
 */
function entry(level, source, message, payload, error) {
  return {
    timestamp: new Date().toISOString(),
    traceId,
    level,
    source,
    message,
    payload: safeSerialize(payload),
    stack: error?.stack ?? null,
  };
}

export const log = Object.freeze({
  /** Current session traceId (for external correlation) */
  traceId,

  /**
   * [ERROR] — Log an error with optional Error object and payload.
   * @param {string} source - Module tag
   * @param {string} message
   * @param {Error} [error]
   * @param {*} [payload]
   */
  error(source, message, error, payload) {
    console.error(`[ERROR][${source}] ${message}`);
    if (payload !== undefined) console.error(`[INPUT][${source}]`, payload);
    if (error) console.error(`[STACK][${source}]`, error);
    persist(entry('error', source, message, payload, error));
  },

  /**
   * [STATE] — Log a warning (typically validation or state anomalies).
   * @param {string} source
   * @param {string} message
   */
  warn(source, message) {
    console.warn(`[STATE][${source}] ${message}`);
    persist(entry('warn', source, message));
  },

  /**
   * [INFO] — Log an informational event.
   * @param {string} source
   * @param {string} message
   */
  info(source, message) {
    console.info(`[INFO][${source}] ${message}`);
    persist(entry('info', source, message));
  },

  /**
   * [OUTPUT] — Log a function result or produced side-effect.
   * @param {string} source
   * @param {string} message
   * @param {*} [payload]
   */
  debug(source, message, payload) {
    console.debug(`[OUTPUT][${source}] ${message}`, payload ?? '');
    persist(entry('debug', source, message, payload));
  },

  /**
   * Retrieve all stored log entries.
   * @returns {LogEntry[]}
   */
  dump() {
    try {
      const raw = localStorage.getItem(LOG_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /** Clear all stored logs. */
  clear() {
    try { localStorage.removeItem(LOG_STORAGE_KEY); } catch { /* noop */ }
  },
});
