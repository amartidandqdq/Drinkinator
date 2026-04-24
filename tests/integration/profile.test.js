/** @file Integration tests for state/profile.js */
import { readProfile, toleranceLabel } from '../../src/state/profile.js';
import { sexFactor, elimRate } from '../../src/core/params.js';
import { DEFAULT_WEIGHT_KG, DEFAULT_CUSTOM_LIMIT } from '../../src/constants.js';

const { run, ok, eq, near, suite } = window.__test;

suite('state/profile');

/**
 * Minimal mock country dataset — includes one regular + one OTHER.
 */
const COUNTRIES = [
  { code: 'FR', name: 'France', flag: '', limit: 0.5, young: 0.2, pro: 0.2 },
  { code: 'DE', name: 'Germany', flag: '', limit: 0.5, young: 0.0, pro: 0.2 },
  { code: 'OTHER', name: 'Other (custom)', flag: '', limit: 0.5, young: null, pro: null },
];

/** Helper: build a ProfileDOM-like mock from plain strings. */
function mkDom({ weight = '80', tolerance = '0.5', country = '0', customLimit = '', sex = 'male' } = {}) {
  return {
    weight: { value: weight },
    tolerance: { value: tolerance },
    country: { value: country },
    customLimit: { value: customLimit },
    getSex: () => sex,
  };
}

// --- readProfile ---

run('readProfile — valid profile returns BACParams', () => {
  const dom = mkDom({ weight: '80', tolerance: '0.5', country: '0', sex: 'male' });
  const p = readProfile(dom, COUNTRIES);
  ok(p !== null, 'not null');
  eq(p.weight, 80, 'weight');
  eq(p.sexFactor, sexFactor('male'), 'sexFactor');
  near(p.elimRate, elimRate('male', 0.5), 0.0001, 'elimRate');
  eq(p.limit, 0.5, 'limit from country');
});

run('readProfile — country OTHER uses customLimit', () => {
  const dom = mkDom({ country: '2', customLimit: '0.8' });
  const p = readProfile(dom, COUNTRIES);
  ok(p !== null, 'not null');
  eq(p.limit, 0.8, 'custom limit applied');
});

run('readProfile — country OTHER with empty customLimit uses DEFAULT_CUSTOM_LIMIT', () => {
  const dom = mkDom({ country: '2', customLimit: '' });
  const p = readProfile(dom, COUNTRIES);
  ok(p !== null, 'not null');
  eq(p.limit, DEFAULT_CUSTOM_LIMIT, 'fallback default custom limit');
});

run('readProfile — empty weight falls back to DEFAULT_WEIGHT_KG', () => {
  const dom = mkDom({ weight: '', country: '0' });
  const p = readProfile(dom, COUNTRIES);
  ok(p !== null, 'not null');
  eq(p.weight, DEFAULT_WEIGHT_KG, 'default weight');
});

run('readProfile — invalid country index (out of range) returns null', () => {
  const dom = mkDom({ country: '999' });
  eq(readProfile(dom, COUNTRIES), null, 'out of range -> null');
});

run('readProfile — non-numeric country value returns null', () => {
  const dom = mkDom({ country: 'abc' });
  eq(readProfile(dom, COUNTRIES), null, 'NaN -> null');
});

run('readProfile — negative country index returns null', () => {
  const dom = mkDom({ country: '-1' });
  eq(readProfile(dom, COUNTRIES), null, 'negative -> null');
});

// --- toleranceLabel ---

run('toleranceLabel — 0 returns "Très faible"', () => {
  eq(toleranceLabel(0), 'Très faible', 'lowest');
});

run('toleranceLabel — 1 returns "Très élevée" (clamped to last)', () => {
  eq(toleranceLabel(1), 'Très élevée', 'highest');
});

run('toleranceLabel — 0.5 returns "Moyenne"', () => {
  eq(toleranceLabel(0.5), 'Moyenne', 'middle');
});

run('toleranceLabel — negative value clamps to "Très faible"', () => {
  eq(toleranceLabel(-0.5), 'Très faible', 'clamp low');
});

run('toleranceLabel — > 1 clamps to "Très élevée"', () => {
  eq(toleranceLabel(2), 'Très élevée', 'clamp high');
});
