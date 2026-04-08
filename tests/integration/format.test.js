/** @file Integration tests for core/format.js */
import { fmtTime, fmtDuration } from '../../src/core/format.js';

const { run, eq, suite } = window.__test;

suite('core/format');

run('fmtDuration — minutes only', () => {
  eq(fmtDuration(45), '45 min', '45 min');
});

run('fmtDuration — hours and minutes', () => {
  eq(fmtDuration(135), '2 h 15', '2h15');
});

run('fmtDuration — exact hour', () => {
  eq(fmtDuration(60), '1 h 00', '1h00');
});

run('fmtDuration — zero', () => {
  eq(fmtDuration(0), '0 min', '0 min');
});

run('fmtTime — produces HH:MM format', () => {
  const now = new Date(2026, 3, 8, 14, 0, 0); // 14:00
  const result = fmtTime(90, now); // 90 min = 15:30
  eq(result, '15:30', 'fmtTime 90min from 14:00');
});

run('fmtTime — wraps past midnight', () => {
  const now = new Date(2026, 3, 8, 23, 0, 0); // 23:00
  const result = fmtTime(120, now); // 120 min = 01:00
  eq(result, '01:00', 'fmtTime wrap midnight');
});
