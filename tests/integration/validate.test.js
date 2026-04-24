/** @file Integration tests for core/validate.js */
import { validateDrink, validateBACParams } from '../../src/core/validate.js';

const { run, ok, eq, suite } = window.__test;

suite('core/validate');

run('validateDrink — valid drink passes', () => {
  const d = { name: 'Beer', vol: 500, abv: 5, time: new Date() };
  ok(validateDrink(d).valid, 'valid drink');
});

run('validateDrink — missing name fails', () => {
  const d = { vol: 500, abv: 5, time: new Date() };
  eq(validateDrink(d).valid, false, 'no name');
});

run('validateDrink — negative vol fails', () => {
  const d = { name: 'X', vol: -1, abv: 5, time: new Date() };
  eq(validateDrink(d).valid, false, 'negative vol');
});

run('validateDrink — abv over 100 fails', () => {
  const d = { name: 'X', vol: 100, abv: 101, time: new Date() };
  eq(validateDrink(d).valid, false, 'abv > 100');
});

run('validateDrink — null fails', () => {
  eq(validateDrink(null).valid, false, 'null');
});

run('validateBACParams — valid params pass', () => {
  const p = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  ok(validateBACParams(p).valid, 'valid params');
});

run('validateBACParams — zero weight fails', () => {
  const p = { weight: 0, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  eq(validateBACParams(p).valid, false, 'weight 0');
});

run('validateBACParams — missing elimRate fails', () => {
  const p = { weight: 80, sexFactor: 0.7, limit: 0.5 };
  eq(validateBACParams(p).valid, false, 'no elimRate');
});

run('validateDrink — NaN vol fails', () => {
  const d = { name: 'X', vol: NaN, abv: 5, time: new Date() };
  eq(validateDrink(d).valid, false, 'vol NaN');
});

run('validateDrink — NaN abv fails', () => {
  const d = { name: 'X', vol: 100, abv: NaN, time: new Date() };
  eq(validateDrink(d).valid, false, 'abv NaN');
});

run('validateBACParams — NaN weight fails', () => {
  const p = { weight: NaN, sexFactor: 0.7, elimRate: 0.12, limit: 0.5 };
  eq(validateBACParams(p).valid, false, 'weight NaN');
});

run('validateBACParams — NaN limit fails', () => {
  const p = { weight: 80, sexFactor: 0.7, elimRate: 0.12, limit: NaN };
  eq(validateBACParams(p).valid, false, 'limit NaN');
});
