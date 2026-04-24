/**
 * @file Renders the status panel (OK / warn / NO GO), timeline bar, and time estimates.
 */

import { BAC_TRACE_THRESHOLD, BLOOD_TO_BREATH_RATIO, TIMELINE_DANGER_SCALE, TIMELINE_MIN_LIMIT } from '../constants.js';

/** French number format: 2 decimals, comma separator. @param {number} n */
const fmtFr = (n) => n.toFixed(2).replace('.', ',');

/**
 * @typedef {Object} StatusElements
 * @property {HTMLElement} panel - Status card container
 * @property {HTMLElement} label - Status text (OK / NO GO)
 * @property {HTMLElement} bacBlood - Blood alcohol display (g/L)
 * @property {HTMLElement} bacBreath - Breath alcohol display (mg/L)
 * @property {HTMLElement} driveTimeRow - "Drive again at" row
 * @property {HTMLElement} driveTime - Drive time value
 * @property {HTMLElement} soberTimeRow - "Fully sober at" row
 * @property {HTMLElement} soberTime - Sober time value
 * @property {HTMLElement} timeline - Timeline bar container
 * @property {HTMLElement} timelineFill - Timeline fill bar
 * @property {HTMLElement} timelineLabel - Timeline label text
 */

/**
 * @typedef {Object} StatusData
 * @property {number} bac - Current BAC in g/L
 * @property {number} limit - Legal limit in g/L
 * @property {number} drinkCount - Number of drinks
 * @property {string|null} driveTimeStr - Formatted drive-again string, or null
 * @property {string|null} soberTimeStr - Formatted sober-at string, or null
 */

/**
 * Render the status panel with current BAC data.
 * @param {StatusElements} els - DOM element references
 * @param {StatusData} data - Computed status data
 * @returns {void}
 */
export function renderStatus(els, data) {
  const { bac, limit, drinkCount, driveTimeStr, soberTimeStr } = data;

  els.bacBlood.textContent = fmtFr(bac) + ' g/L';
  els.bacBreath.textContent = fmtFr(bac * BLOOD_TO_BREATH_RATIO) + ' mg/L';
  els.panel.classList.remove('ok', 'warn', 'danger');

  if (bac <= BAC_TRACE_THRESHOLD && drinkCount === 0) {
    els.panel.classList.add('ok');
    els.label.textContent = 'OK';
  } else if (bac <= limit) {
    if (bac > BAC_TRACE_THRESHOLD) {
      els.panel.classList.add('warn');
      els.label.textContent = 'OK (pas sobre)';
    } else {
      els.panel.classList.add('ok');
      els.label.textContent = 'OK';
    }
  } else {
    els.panel.classList.add('danger');
    els.label.textContent = 'INTERDIT';
  }

  // Drive time
  els.driveTimeRow.style.display = driveTimeStr ? '' : 'none';
  if (driveTimeStr) els.driveTime.textContent = driveTimeStr;

  // Sober time
  els.soberTimeRow.style.display = soberTimeStr ? '' : 'none';
  if (soberTimeStr) els.soberTime.textContent = soberTimeStr;

  // Timeline bar
  if (bac <= BAC_TRACE_THRESHOLD) {
    els.timeline.style.display = 'none';
    return;
  }
  els.timeline.style.display = '';
  if (bac > limit) {
    const pct = Math.min(100, (bac / (limit * TIMELINE_DANGER_SCALE)) * 100);
    els.timelineFill.style.width = pct + '%';
    els.timelineFill.style.background = 'linear-gradient(90deg, var(--danger), var(--warn))';
  } else {
    const pct = Math.min(100, (bac / Math.max(TIMELINE_MIN_LIMIT, limit)) * 100);
    els.timelineFill.style.width = pct + '%';
    els.timelineFill.style.background = 'linear-gradient(90deg, var(--ok), var(--warn))';
  }
  const breath = bac * BLOOD_TO_BREATH_RATIO;
  const breathLimit = limit * BLOOD_TO_BREATH_RATIO;
  els.timelineLabel.textContent = `${fmtFr(bac)}/${fmtFr(limit)} g/L \u2022 ${fmtFr(breath)}/${fmtFr(breathLimit)} mg/L`;
}
