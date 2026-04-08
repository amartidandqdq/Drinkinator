/**
 * @file Time-picker modal — lets user choose "now", a specific time, or "X ago".
 */

import { MS_PER_MINUTE } from '../constants.js';

/**
 * @typedef {Object} TimeModal
 * @property {(name: string, vol: number, abv: number) => void} open - Show modal for a drink
 * @property {() => void} close - Hide modal
 */

/**
 * Create and wire a time-picker modal.
 * @param {HTMLElement} overlay - The .modal-overlay element
 * @param {(name: string, vol: number, abv: number, time: Date) => void} onConfirm - Called with final drink + time
 * @returns {TimeModal}
 */
export function createTimeModal(overlay, onConfirm) {
  const nameEl = /** @type {HTMLElement} */ (overlay.querySelector('#modal-drink-name'));
  const infoEl = /** @type {HTMLElement} */ (overlay.querySelector('#modal-drink-info'));
  const timeInput = /** @type {HTMLInputElement} */ (overlay.querySelector('#modal-time'));
  const tabs = overlay.querySelectorAll('.time-mode-tab');
  const modeContents = {
    now: overlay.querySelector('#mode-now'),
    clock: overlay.querySelector('#mode-clock'),
    ago: overlay.querySelector('#mode-ago'),
  };

  /** @type {{ name: string, vol: number, abv: number } | null} */
  let pending = null;

  /** @param {'now'|'clock'|'ago'} mode */
  const MODE_KEYS = ['now', 'clock', 'ago'];

  function setMode(mode) {
    tabs.forEach((t, i) => {
      t.classList.toggle('active', MODE_KEYS[i] === mode);
    });
    Object.entries(modeContents).forEach(([k, el]) => {
      el.classList.toggle('active', k === mode);
    });
  }

  /** @param {Date} time */
  function confirm(time) {
    if (!pending) return;
    onConfirm(pending.name, pending.vol, pending.abv, time);
    close();
  }

  function close() {
    overlay.classList.remove('active');
    pending = null;
  }

  // Wire static buttons
  overlay.querySelector('.close-modal').addEventListener('click', close);
  overlay.querySelector('#mode-now .btn').addEventListener('click', () => confirm(new Date()));
  overlay.querySelector('#mode-clock .btn').addEventListener('click', () => {
    const val = timeInput.value;
    if (!val) return;
    const [h, m] = val.split(':').map(Number);
    const t = new Date();
    t.setHours(h, m, 0, 0);
    if (t > new Date()) t.setDate(t.getDate() - 1);
    confirm(t);
  });

  // Ago quick buttons
  overlay.querySelectorAll('.ago-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.dataset.mins, 10);
      confirm(new Date(Date.now() - mins * MS_PER_MINUTE));
    });
  });

  // Ago custom
  const agoVal = /** @type {HTMLInputElement} */ (overlay.querySelector('#ago-value'));
  const agoUnit = /** @type {HTMLSelectElement} */ (overlay.querySelector('#ago-unit'));
  overlay.querySelector('.ago-custom-row .btn').addEventListener('click', () => {
    let v = parseFloat(agoVal.value);
    if (!v || v <= 0) return;
    if (agoUnit.value === 'h') v *= 60;
    confirm(new Date(Date.now() - v * MS_PER_MINUTE));
  });

  // Tab switching
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => setMode(MODE_KEYS[i]));
  });

  return {
    open(name, vol, abv) {
      pending = { name, vol, abv };
      nameEl.textContent = name;
      infoEl.textContent = `${vol} mL \u2022 ${abv}% ABV`;
      const now = new Date();
      timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setMode('now');
      overlay.classList.add('active');
    },
    close,
  };
}
