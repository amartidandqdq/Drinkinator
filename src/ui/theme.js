/**
 * @file Theme toggle — persists user choice, follows system preference by default.
 *       Initial `data-theme` is set by an inline script in index.html to avoid FOUC.
 */

import { THEME_STORAGE_KEY, THEME_DARK, THEME_LIGHT } from '../constants.js';

/**
 * Read the current theme from the document root.
 * @returns {'dark'|'light'}
 */
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === THEME_LIGHT ? THEME_LIGHT : THEME_DARK;
}

/**
 * Apply a theme to the document root and sync the toggle's aria-pressed state.
 * @param {'dark'|'light'} theme
 * @param {HTMLElement} button
 */
function applyTheme(theme, button) {
  document.documentElement.setAttribute('data-theme', theme);
  button.setAttribute('aria-pressed', theme === THEME_LIGHT ? 'true' : 'false');
}

/**
 * Wire a button to toggle between light and dark theme.
 * The initial theme is set by an inline script in index.html to avoid FOUC.
 * @param {HTMLElement} button - Toggle button element
 * @returns {void}
 */
export function initTheme(button) {
  applyTheme(currentTheme(), button);

  button.addEventListener('click', () => {
    const next = currentTheme() === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    applyTheme(next, button);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* private browsing / quota */ }
  });

  /** Follow system changes only if user hasn't made an explicit choice. */
  const mq = matchMedia('(prefers-color-scheme: light)');
  mq.addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem(THEME_STORAGE_KEY); } catch { /* noop */ }
    if (!saved) applyTheme(e.matches ? THEME_LIGHT : THEME_DARK, button);
  });
}
