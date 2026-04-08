/** @file Integration tests for core/params.js */
import { sexFactor, elimRate } from '../../src/core/params.js';

const { run, eq, near, suite } = window.__test;

suite('core/params');

run('sexFactor — male returns 0.7', () => {
  eq(sexFactor('male'), 0.7, 'male factor');
});

run('sexFactor — female returns 0.6', () => {
  eq(sexFactor('female'), 0.6, 'female factor');
});

run('elimRate — male at tolerance 0 returns min', () => {
  near(elimRate('male', 0), 0.10, 0.001, 'male min');
});

run('elimRate — male at tolerance 1 returns max', () => {
  near(elimRate('male', 1), 0.15, 0.001, 'male max');
});

run('elimRate — female at tolerance 0 returns min', () => {
  near(elimRate('female', 0), 0.085, 0.001, 'female min');
});

run('elimRate — female at tolerance 1 returns max', () => {
  near(elimRate('female', 1), 0.10, 0.001, 'female max');
});

run('elimRate — male midpoint interpolation', () => {
  near(elimRate('male', 0.5), 0.125, 0.001, 'male mid');
});
