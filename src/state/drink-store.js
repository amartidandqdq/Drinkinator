/**
 * @file Reactive drink store — manages drink list with change notifications.
 */

/** @typedef {import('../types.js').Drink} Drink */

/**
 * @typedef {Object} DrinkStore
 * @property {(name: string, vol: number, abv: number, time: Date) => void} add - Add a drink
 * @property {(index: number) => void} remove - Remove drink at index
 * @property {() => void} clear - Remove all drinks
 * @property {() => Drink[]} getAll - Get current drink list (read-only copy)
 */

/**
 * Create a drink store that notifies on every mutation.
 * @param {() => void} onChange - Called after any add/remove/clear
 * @returns {DrinkStore}
 */
export function createDrinkStore(onChange) {
  /** @type {Drink[]} */
  let drinks = [];

  return {
    add(name, vol, abv, time) {
      drinks.push({ name, vol, abv, time: new Date(time) });
      onChange();
    },
    remove(index) {
      drinks.splice(index, 1);
      onChange();
    },
    clear() {
      drinks = [];
      onChange();
    },
    getAll() {
      return [...drinks];
    },
  };
}
