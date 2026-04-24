/**
 * @file Renders preset buttons and wires click handlers.
 */

/** @typedef {import('../types.js').Preset} Preset */

/**
 * Populate a container with preset buttons. Each click invokes `onSelect`.
 * @param {HTMLElement} container - Target element to append buttons into
 * @param {Preset[]} presets - Drink preset dataset
 * @param {(name: string, vol: number, abv: number) => void} onSelect - Called when a preset is clicked
 * @returns {void}
 */
export function renderPresets(container, presets, onSelect) {
  for (const p of presets) {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.textContent = `${p.icon} ${p.name}`;
    btn.title = `${p.vol} mL / ${p.abv}%`;
    btn.addEventListener('click', () => onSelect(p.name, p.vol, p.abv));
    container.appendChild(btn);
  }
}
