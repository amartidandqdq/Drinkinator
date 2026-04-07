/**
 * @file Entry point — wires all dependencies and boots the app.
 */

import { COUNTRIES, PRESETS } from './data/index.js';
import { computeBAC, drinkBAC, findTimeTo, fmtTime, fmtDuration } from './core/index.js';
import { createDrinkStore, readProfile, toleranceLabel } from './state/index.js';
import { renderStatus, renderDrinkList, createTimeModal } from './ui/index.js';

// === DOM refs ===
const $ = (/** @type {string} */ id) => document.getElementById(id);

const profileDOM = {
  weight: /** @type {HTMLInputElement} */ ($('weight')),
  tolerance: /** @type {HTMLInputElement} */ ($('tolerance')),
  country: /** @type {HTMLSelectElement} */ ($('country')),
  customLimit: /** @type {HTMLInputElement} */ ($('custom-limit')),
  getSex: () => /** @type {HTMLInputElement} */ (document.querySelector('input[name="sex"]:checked')).value,
};

const statusEls = {
  panel: $('status-panel'),
  label: $('status-label'),
  bacBlood: $('bac-blood'),
  bacBreath: $('bac-breath'),
  driveTimeRow: $('drive-time-row'),
  driveTime: $('drive-time'),
  soberTimeRow: $('sober-time-row'),
  soberTime: $('sober-time'),
  timeline: $('timeline'),
  timelineFill: $('timeline-fill'),
  timelineLabel: $('timeline-label'),
};

const drinkListEl = $('drink-list');
const clearBtn = $('clear-btn');
const toleranceLabelEl = $('tolerance-label');

// === Compute + render cycle ===
function update() {
  const params = readProfile(profileDOM, COUNTRIES);
  const drinks = store.getAll();
  const now = new Date();
  const bac = computeBAC(drinks, now, params);

  toleranceLabelEl.textContent = toleranceLabel(parseFloat(profileDOM.tolerance.value));

  let driveTimeStr = null;
  let soberTimeStr = null;

  if (bac > 0.001) {
    if (bac > params.limit) {
      const mins = findTimeTo(params.limit, drinks, now, params, computeBAC);
      driveTimeStr = `${fmtDuration(mins)} (${fmtTime(mins, now)})`;
    }
    const soberMins = findTimeTo(0.001, drinks, now, params, computeBAC);
    soberTimeStr = `${fmtDuration(soberMins)} (${fmtTime(soberMins, now)})`;
  }

  renderStatus(statusEls, { bac, limit: params.limit, drinkCount: drinks.length, driveTimeStr, soberTimeStr });
  renderDrinkList(drinkListEl, clearBtn, drinks, drinkBAC, params, (i) => store.remove(i));
}

// === Store ===
const store = createDrinkStore(update);

// === Modal ===
const modal = createTimeModal($('time-modal'), (name, vol, abv, time) => {
  store.add(name, vol, abv, time);
});

// === Presets ===
const presetsEl = $('presets');
for (const p of PRESETS) {
  const btn = document.createElement('button');
  btn.className = 'preset-btn';
  btn.textContent = `${p.icon} ${p.name}`;
  btn.title = `${p.vol} mL / ${p.abv}%`;
  btn.addEventListener('click', () => modal.open(p.name, p.vol, p.abv));
  presetsEl.appendChild(btn);
}

// === Custom drink ===
$('custom-add-btn').addEventListener('click', () => {
  const vol = parseFloat(/** @type {HTMLInputElement} */ ($('custom-vol')).value);
  const abv = parseFloat(/** @type {HTMLInputElement} */ ($('custom-abv')).value);
  if (!vol || !abv) return;
  modal.open(`Custom (${vol}mL, ${abv}%)`, vol, abv);
});

// === Clear all ===
clearBtn.addEventListener('click', () => store.clear());

// === Country dropdown ===
const countrySel = profileDOM.country;
COUNTRIES.forEach((c, i) => {
  const opt = document.createElement('option');
  opt.value = String(i);
  opt.textContent = `${c.flag} ${c.name} (${c.limit} g/L)`;
  countrySel.appendChild(opt);
});

countrySel.addEventListener('change', () => {
  const c = COUNTRIES[countrySel.value];
  $('custom-limit-row').style.display = c.code === 'OTHER' ? '' : 'none';
  update();
});

// === Profile listeners ===
['weight', 'tolerance', 'custom-limit'].forEach(id =>
  $(id).addEventListener('input', update));
document.querySelectorAll('input[name="sex"]').forEach(r =>
  r.addEventListener('change', update));

// === Boot ===
update();
setInterval(update, 30_000);
