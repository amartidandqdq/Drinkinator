/** @file Integration tests for core/bac.js */
import { drinkBAC, computeBAC } from '../../src/core/bac.js';

const { run, eq, near, suite } = window.__test;

suite('core/bac');

run('drinkBAC — single beer for 80kg male', () => {
  const drink = { name: 'Beer', vol: 500, abv: 5, time: new Date() };
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  const bac = drinkBAC(drink, params);
  // 500 * 0.05 * 0.8 / (0.7 * 80) = 20 / 56 ≈ 0.357
  near(bac, 0.357, 0.001, 'drinkBAC beer');
});

run('drinkBAC — whisky shot for 60kg female', () => {
  const drink = { name: 'Whisky', vol: 40, abv: 40, time: new Date() };
  const params = { weight: 60, sexFactor: 0.6, elimRate: 0.09, limit: 0.5 };
  const bac = drinkBAC(drink, params);
  // 40 * 0.4 * 0.8 / (0.6 * 60) = 12.8 / 36 ≈ 0.356
  near(bac, 0.356, 0.001, 'drinkBAC whisky');
});

run('computeBAC — no drinks returns 0', () => {
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  eq(computeBAC([], new Date(), params), 0, 'empty drinks');
});

run('computeBAC — single drink just consumed', () => {
  const now = new Date();
  const drink = { name: 'Beer', vol: 500, abv: 5, time: now };
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  const bac = computeBAC([drink], now, params);
  near(bac, 0.357, 0.001, 'BAC at t=0');
});

run('computeBAC — drink 2 hours ago is partially eliminated', () => {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 3_600_000);
  const drink = { name: 'Beer', vol: 500, abv: 5, time: twoHoursAgo };
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  const bac = computeBAC([drink], now, params);
  // 0.357 - 0.12 * 2 = 0.117 (single drink: new and old models agree)
  near(bac, 0.117, 0.01, 'BAC after 2h');
});

run('computeBAC — fully eliminated drink returns 0', () => {
  const now = new Date();
  const longAgo = new Date(now.getTime() - 10 * 3_600_000);
  const drink = { name: 'Beer', vol: 500, abv: 5, time: longAgo };
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  eq(computeBAC([drink], now, params), 0, 'fully eliminated');
});

run('computeBAC — 4 simultaneous drinks eliminate at absolute rate', () => {
  // Regression lock: old per-drink model gave N*elimRate decay.
  // New Widmark model: total BAC decays at elimRate (absolute g/L/h).
  const now = new Date();
  const t0 = new Date(now.getTime() - 2.5 * 3_600_000);
  // vol=420, abv=5, sexFactor=0.7, weight=80 -> peak = 420*0.05*0.8/56 = 0.3
  const mk = () => ({ name: 'X', vol: 420, abv: 5, time: t0 });
  const drinks = [mk(), mk(), mk(), mk()];
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.15, limit: 0.5 };
  const bac = computeBAC(drinks, now, params);
  // 4 * 0.3 - 0.15 * 2.5 = 1.2 - 0.375 = 0.825
  near(bac, 0.825, 0.001, 'BAC 4 simultaneous at t=2.5h');
});

run('computeBAC — drinks out of order are processed chronologically', () => {
  const now = new Date();
  const t2 = new Date(now.getTime() - 2 * 3_600_000);
  const t1 = new Date(now.getTime() - 3 * 3_600_000);
  const d1 = { name: 'Beer', vol: 500, abv: 5, time: t1 };
  const d2 = { name: 'Beer', vol: 500, abv: 5, time: t2 };
  const params = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  // peak=0.357 each. After t1: bac=0.357. Between t1 and t2 (1h): 0.357-0.12=0.237.
  // Add peak at t2: 0.237+0.357=0.594. From t2 to now (2h): 0.594-0.24=0.354.
  const bac = computeBAC([d2, d1], now, params);
  near(bac, 0.354, 0.01, 'BAC chronological ordering');
});
