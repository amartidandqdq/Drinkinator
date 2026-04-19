/** @file Entry point — wires all dependencies and boots the app. */
import { COUNTRIES, PRESETS } from './data/index.js';
import { computeBAC, drinkBAC, findTimeTo, fmtTime, fmtDuration, log, validateBACParams } from './core/index.js';
import { createDrinkStore, readProfile, toleranceLabel } from './state/index.js';
import { renderStatus, renderDrinkList, createTimeModal, initTheme } from './ui/index.js';
import { BAC_TRACE_THRESHOLD, UPDATE_INTERVAL_MS } from './constants.js';

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
  let params, drinks, now, bac;
  // Block 1 — read profile + state
  try {
    params = readProfile(profileDOM, COUNTRIES);
    const check = validateBACParams(params);
    if (!check.valid) {
      log.warn('profile', `Invalid BACParams: ${check.reason}`);
      return;
    }
    drinks = store.getAll();
    now = new Date();
    toleranceLabelEl.textContent = toleranceLabel(parseFloat(profileDOM.tolerance.value));
  } catch (err) {
    log.error('profile', 'readProfile failed', err);
    return;
  }

  // Block 2 — BAC computation
  let driveTimeStr = null, soberTimeStr = null;
  try {
    bac = computeBAC(drinks, now, params);
    if (bac > BAC_TRACE_THRESHOLD) {
      if (bac > params.limit) {
        const mins = findTimeTo(params.limit, drinks, now, params, computeBAC);
        driveTimeStr = `${fmtDuration(mins)} (${fmtTime(mins, now)})`;
      }
      const soberMins = findTimeTo(BAC_TRACE_THRESHOLD, drinks, now, params, computeBAC);
      soberTimeStr = `${fmtDuration(soberMins)} (${fmtTime(soberMins, now)})`;
    }
  } catch (err) {
    log.error('bac', 'BAC computation failed', err, { drinkCount: drinks.length, params });
    return;
  }

  // Block 3 — render UI
  try {
    renderStatus(statusEls, { bac, limit: params.limit, drinkCount: drinks.length, driveTimeStr, soberTimeStr });
    renderDrinkList(drinkListEl, clearBtn, drinks, drinkBAC, params, (i) => store.remove(i));
  } catch (err) {
    log.error('ui', 'Render failed', err, { bac });
  }
}

// === Store ===
const store = createDrinkStore(update);

// === Modal ===
const modal = createTimeModal($('time-modal'), (name, vol, abv, time) => {
  try {
    store.add(name, vol, abv, time);
  } catch (err) {
    log.error('store', 'Failed to add drink', err, { name, vol, abv, time });
  }
});

// === Presets ===
const presetsEl = $('presets');
for (const p of PRESETS) {
  const btn = document.createElement('button');
  btn.className = 'preset-btn';
  btn.textContent = `${p.icon} ${p.name}`;
  btn.title = `${p.vol} mL / ${p.abv}%`;
  btn.addEventListener('click', () => {
    try { modal.open(p.name, p.vol, p.abv); }
    catch (err) { log.error('app', 'Preset click failed', err, { preset: p.name }); }
  });
  presetsEl.appendChild(btn);
}

// === Custom drink ===
$('custom-add-btn').addEventListener('click', () => {
  try {
    const vol = parseFloat(/** @type {HTMLInputElement} */ ($('custom-vol')).value);
    const abv = parseFloat(/** @type {HTMLInputElement} */ ($('custom-abv')).value);
    if (!vol || !abv) return;
    modal.open(`Custom (${vol}mL, ${abv}%)`, vol, abv);
  } catch (err) {
    log.error('app', 'Custom drink failed', err);
  }
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

// === Theme ===
try {
  initTheme($('theme-toggle'));
} catch (err) {
  log.error('theme', 'initTheme failed', err);
}

// === Boot ===
update();
setInterval(update, UPDATE_INTERVAL_MS);
log.info('app', 'Drinkinator booted');
