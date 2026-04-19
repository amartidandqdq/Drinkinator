/**
 * @file Renders the list of consumed drinks with BAC contribution and remove button.
 */

/** @typedef {import('../types.js').Drink} Drink */
/** @typedef {import('../types.js').BACParams} BACParams */

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** @param {string} s */
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

/**
 * Render the drink list into a container element.
 * @param {HTMLElement} listEl - Container for drink items
 * @param {HTMLElement} clearBtn - "Clear all" button (shown/hidden)
 * @param {Drink[]} drinks - Current drink list
 * @param {(drink: Drink, params: BACParams) => number} bacFn - BAC contribution calculator
 * @param {BACParams} params - Current body parameters
 * @param {(index: number) => void} onRemove - Callback when remove button clicked
 * @returns {void}
 */
export function renderDrinkList(listEl, clearBtn, drinks, bacFn, params, onRemove) {
  clearBtn.style.display = drinks.length ? '' : 'none';

  if (!drinks.length) {
    listEl.innerHTML =
      '<p style="text-align:center;color:var(--muted);font-size:0.85rem;padding:12px 0;">' +
      'Aucune consommation. Appuyez sur un preset ci-dessus !</p>';
    return;
  }

  listEl.innerHTML = drinks.map((d, i) => {
    const hh = String(d.time.getHours()).padStart(2, '0');
    const mm = String(d.time.getMinutes()).padStart(2, '0');
    const contrib = bacFn(d, params);
    const safeName = escapeHtml(d.name);
    return `<div class="drink-item">
      <div class="info">
        <strong>${safeName}</strong><br>
        <span>${d.vol} mL &bull; ${d.abv}% &bull; ${hh}:${mm}</span>
      </div>
      <div class="bac-contrib">+${contrib.toFixed(3)}</div>
      <button class="remove" data-idx="${i}" aria-label="Supprimer ${safeName}">&times;</button>
    </div>`;
  }).join('');

  // Bind remove buttons via delegation
  listEl.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => onRemove(Number(btn.dataset.idx)));
  });
}
