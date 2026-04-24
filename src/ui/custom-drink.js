/**
 * @file Wires the "custom drink" form that opens the modal with user-chosen vol/abv.
 */

/**
 * Attach the click handler that reads vol/abv and forwards to `onSelect`.
 * @param {HTMLButtonElement} addBtn - Submit button
 * @param {HTMLInputElement} volInput - Volume input (mL)
 * @param {HTMLInputElement} abvInput - ABV input (%)
 * @param {(name: string, vol: number, abv: number) => void} onSelect - Forwarded drink details
 * @returns {void}
 */
export function wireCustomDrink(addBtn, volInput, abvInput, onSelect) {
  addBtn.addEventListener('click', () => {
    const vol = parseFloat(volInput.value);
    const abv = parseFloat(abvInput.value);
    if (!vol || !abv) return;
    onSelect(`Custom (${vol}mL, ${abv}%)`, vol, abv);
  });
}
