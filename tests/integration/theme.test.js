/** @file Integration tests for ui/theme.js */
import { initTheme } from '../../src/ui/theme.js';
import { THEME_STORAGE_KEY } from '../../src/constants.js';

const { run, ok, eq, suite } = window.__test;

/**
 * Create a throwaway toggle button and ensure a clean slate.
 * Tests share the real document root, so we reset data-theme + localStorage.
 */
function makeButton(initial = 'dark') {
  try { localStorage.removeItem(THEME_STORAGE_KEY); } catch { /* noop */ }
  document.documentElement.setAttribute('data-theme', initial);
  const btn = document.createElement('button');
  document.body.appendChild(btn);
  return btn;
}

suite('ui/theme');

run('initTheme — syncs aria-pressed to current theme', () => {
  const btn = makeButton('dark');
  initTheme(btn);
  eq(btn.getAttribute('aria-pressed'), 'false', 'dark → aria-pressed=false');
});

run('initTheme — click toggles dark → light', () => {
  const btn = makeButton('dark');
  initTheme(btn);
  btn.click();
  eq(document.documentElement.getAttribute('data-theme'), 'light', 'data-theme');
  eq(btn.getAttribute('aria-pressed'), 'true', 'aria-pressed');
});

run('initTheme — click toggles light → dark', () => {
  const btn = makeButton('light');
  initTheme(btn);
  btn.click();
  eq(document.documentElement.getAttribute('data-theme'), 'dark', 'data-theme');
  eq(btn.getAttribute('aria-pressed'), 'false', 'aria-pressed');
});

run('initTheme — click persists choice to localStorage', () => {
  const btn = makeButton('dark');
  initTheme(btn);
  btn.click();
  let saved = null;
  try { saved = localStorage.getItem(THEME_STORAGE_KEY); } catch { /* noop */ }
  eq(saved, 'light', 'saved theme');
  try { localStorage.removeItem(THEME_STORAGE_KEY); } catch { /* noop */ }
});

run('initTheme — round trip returns to starting state', () => {
  const btn = makeButton('dark');
  initTheme(btn);
  btn.click();
  btn.click();
  eq(document.documentElement.getAttribute('data-theme'), 'dark', 'back to dark');
  eq(btn.getAttribute('aria-pressed'), 'false', 'aria-pressed back');
  try { localStorage.removeItem(THEME_STORAGE_KEY); } catch { /* noop */ }
});
