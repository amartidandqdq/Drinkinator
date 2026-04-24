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
  const volInput = /** @type {HTMLInputElement} */ (overlay.querySelector('#modal-vol'));
  const abvInput = /** @type {HTMLInputElement} */ (overlay.querySelector('#modal-abv'));
  const timeInput = /** @type {HTMLInputElement} */ (overlay.querySelector('#modal-time'));
  const tabs = /** @type {NodeListOf<HTMLElement>} */ (overlay.querySelectorAll('.time-mode-tab'));
  const modeContents = {
    now: overlay.querySelector('#mode-now'),
    clock: overlay.querySelector('#mode-clock'),
    ago: overlay.querySelector('#mode-ago'),
  };

  /** @type {{ name: string } | null} */
  let pending = null;

  /** @param {'now'|'clock'|'ago'} mode */
  function setMode(mode) {
    tabs.forEach((t) => {
      t.classList.toggle('active', t.dataset.mode === mode);
    });
    Object.entries(modeContents).forEach(([k, el]) => {
      el.classList.toggle('active', k === mode);
    });
  }

  /** @param {Date} time */
  function confirm(time) {
    if (!pending) return;
    const vol = parseFloat(volInput.value);
    const abv = parseFloat(abvInput.value);
    if (!vol || vol <= 0 || !Number.isFinite(abv) || abv < 0) return;
    onConfirm(pending.name, vol, abv, time);
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
    const now = new Date();
    const t = new Date(now);
    t.setHours(h, m, 0, 0);
    if (t > now) t.setDate(t.getDate() - 1);
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
  tabs.forEach((t) => {
    t.addEventListener('click', () => setMode(/** @type {'now'|'clock'|'ago'} */ (t.dataset.mode)));
  });

  return {
    open(name, vol, abv) {
      pending = { name };
      nameEl.textContent = name;
      volInput.value = String(vol);
      abvInput.value = String(abv);
      const now = new Date();
      timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setMode('now');
      overlay.classList.add('active');
    },
    close,
  };
}
