/** @file Entry point — wires all dependencies and boots the app. */
import { COUNTRIES, PRESETS } from './data/index.js';
import {
  computeBAC, drinkBAC, findTimeTo, fmtTime, fmtDuration,
  log, validateBACParams, validateDrink,
} from './core/index.js';
import { createDrinkStore, readProfile, toleranceLabel } from './state/index.js';
import {
  renderStatus, renderDrinkList, createTimeModal, initTheme,
  renderPresets, wireCustomDrink, initCountrySelect,
} from './ui/index.js';
import { BAC_TRACE_THRESHOLD, UPDATE_INTERVAL_MS } from './constants.js';

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

function update() {
  let params, drinks, now, bac;
  try {
    params = readProfile(profileDOM, COUNTRIES);
    if (params === null) {
      log.warn('profile', 'readProfile returned null (invalid country index)');
      return;
    }
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

  try {
    renderStatus(statusEls, { bac, limit: params.limit, drinkCount: drinks.length, driveTimeStr, soberTimeStr });
    renderDrinkList(drinkListEl, clearBtn, drinks, drinkBAC, params, (i) => store.remove(i));
  } catch (err) {
    log.error('ui', 'Render failed', err, { bac });
  }
}

const store = createDrinkStore(update);

const modal = createTimeModal($('time-modal'), (name, vol, abv, time) => {
  const check = validateDrink({ name, vol, abv, time });
  if (!check.valid) {
    log.warn('store', `Invalid drink rejected: ${check.reason}`);
    return;
  }
  try {
    store.add(name, vol, abv, time);
  } catch (err) {
    log.error('store', 'Failed to add drink', err, { name, vol, abv, time });
  }
});

try {
  renderPresets($('presets'), PRESETS, (name, vol, abv) => modal.open(name, vol, abv));
} catch (err) {
  log.error('app', 'renderPresets failed', err);
}

try {
  wireCustomDrink(
    /** @type {HTMLButtonElement} */ ($('custom-add-btn')),
    /** @type {HTMLInputElement} */ ($('custom-vol')),
    /** @type {HTMLInputElement} */ ($('custom-abv')),
    (name, vol, abv) => modal.open(name, vol, abv),
  );
} catch (err) {
  log.error('app', 'wireCustomDrink failed', err);
}

clearBtn.addEventListener('click', () => store.clear());

try {
  initCountrySelect(profileDOM.country, $('custom-limit-row'), COUNTRIES, update);
} catch (err) {
  log.error('app', 'initCountrySelect failed', err);
}

['weight', 'tolerance', 'custom-limit'].forEach(id =>
  $(id).addEventListener('input', update));
document.querySelectorAll('input[name="sex"]').forEach(r =>
  r.addEventListener('change', update));

try {
  initTheme($('theme-toggle'));
} catch (err) {
  log.error('theme', 'initTheme failed', err);
}

update();
setInterval(update, UPDATE_INTERVAL_MS);
log.info('app', 'Drinkinator booted');
