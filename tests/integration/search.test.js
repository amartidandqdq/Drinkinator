/** @file Integration tests for core/search.js */
import { findTimeTo } from '../../src/core/search.js';
import { computeBAC } from '../../src/core/bac.js';
import { MAX_SEARCH_HOURS, MS_PER_MINUTE } from '../../src/constants.js';

const { run, ok, eq, near, suite } = window.__test;

suite('core/search');

run('findTimeTo — no drinks returns ~0', () => {
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  const minutes = findTimeTo(0.5, [], new Date(), params, computeBAC);
  near(minutes, 0, 0.01, 'no drinks -> 0');
});

run('findTimeTo — BAC already below target returns ~0', () => {
  const now = new Date();
  // Drink consumed 5h ago -> mostly eliminated
  const longAgo = new Date(now.getTime() - 5 * 3_600_000);
  const drink = { name: 'Beer', vol: 330, abv: 5, time: longAgo };
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.15, limit: 0.5 };
  const minutes = findTimeTo(0.5, [drink], now, params, computeBAC);
  near(minutes, 0, 0.01, 'already below target');
});

run('findTimeTo — single drink now, descend to 0.5 g/L', () => {
  const now = new Date();
  // peak = 500 * 0.05 * 0.8 / (0.7 * 80) ≈ 0.357 — below 0.5 already, use bigger drink
  // vol=1000 -> peak = 1000*0.05*0.8/56 ≈ 0.714
  const drink = { name: 'Big Beer', vol: 1000, abv: 5, time: now };
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  const minutes = findTimeTo(0.5, [drink], now, params, computeBAC);
  // hours = (peak - target) / elimRate = (0.714 - 0.5) / 0.12 ≈ 1.786h ≈ 107.1 min
  const expected = (0.714 - 0.5) / 0.12 * 60;
  ok(minutes > 0, 'positive minutes');
  near(minutes, expected, 5, 'minutes within ±5 of analytical');
});

run('findTimeTo — target already met (target > peak) returns ~0', () => {
  const now = new Date();
  const drink = { name: 'Beer', vol: 330, abv: 5, time: now };
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  // peak ≈ 330*0.05*0.8/56 ≈ 0.236 — already below 0.8
  const minutes = findTimeTo(0.8, [drink], now, params, computeBAC);
  near(minutes, 0, 0.01, 'target above peak -> 0');
});

run('findTimeTo — beyond horizon clamps to MAX_SEARCH_HOURS*60', () => {
  const now = new Date();
  // Massive peak, tiny elimRate -> would need > MAX_SEARCH_HOURS to reach 0
  // 20 drinks of 500mL 40% now: peak ≈ 20 * 500*0.4*0.8/56 ≈ 57 g/L
  const drinks = Array.from({ length: 20 }, () => ({
    name: 'X', vol: 500, abv: 40, time: now,
  }));
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.10, limit: 0.5 };
  const minutes = findTimeTo(0.5, drinks, now, params, computeBAC);
  eq(minutes, MAX_SEARCH_HOURS * 60, 'clamped to upper bound');
});

run('findTimeTo — MS_PER_MINUTE constant sanity', () => {
  // Sanity check that the constant used for time math is what we expect.
  eq(MS_PER_MINUTE, 60_000, 'MS_PER_MINUTE = 60000');
});
