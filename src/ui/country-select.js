/**
 * @file Populates the country dropdown and wires the change handler
 *       that toggles the custom-limit row and triggers a recomputation.
 */

/** @typedef {import('../types.js').Country} Country */

/**
 * Populate the select with countries and wire the change listener.
 * @param {HTMLSelectElement} select - Target select element (expected empty)
 * @param {HTMLElement} customLimitRow - Row shown only when "OTHER" is selected
 * @param {Country[]} countries - Dataset
 * @param {() => void} onChange - Invoked after each change (typically to recompute BAC)
 * @returns {void}
 */
export function initCountrySelect(select, customLimitRow, countries, onChange) {
  countries.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `${c.flag} ${c.name} (${c.limit} g/L)`;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    const idx = Number(select.value);
    const c = countries[idx];
    customLimitRow.style.display = c && c.code === 'OTHER' ? '' : 'none';
    onChange();
  });
}
