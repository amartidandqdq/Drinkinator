/** @file Integration tests for state/drink-store.js */
import { createDrinkStore } from '../../src/state/drink-store.js';

const { run, eq, ok, suite } = window.__test;

suite('state/drink-store');

run('store starts empty', () => {
  const store = createDrinkStore(() => {});
  eq(store.getAll().length, 0, 'empty');
});

run('add() adds a drink and triggers onChange', () => {
  let called = 0;
  const store = createDrinkStore(() => called++);
  store.add('Beer', 500, 5, new Date());
  eq(store.getAll().length, 1, 'one drink');
  eq(called, 1, 'onChange called');
});

run('add() creates correct Drink object', () => {
  const store = createDrinkStore(() => {});
  const t = new Date();
  store.add('Whisky', 40, 40, t);
  const d = store.getAll()[0];
  eq(d.name, 'Whisky', 'name');
  eq(d.vol, 40, 'vol');
  eq(d.abv, 40, 'abv');
  ok(d.time instanceof Date, 'time is Date');
});

run('remove() removes drink at index', () => {
  let called = 0;
  const store = createDrinkStore(() => called++);
  store.add('A', 100, 5, new Date());
  store.add('B', 200, 10, new Date());
  store.remove(0);
  eq(store.getAll().length, 1, 'one left');
  eq(store.getAll()[0].name, 'B', 'B remains');
  eq(called, 3, 'onChange x3');
});

run('clear() empties store', () => {
  const store = createDrinkStore(() => {});
  store.add('A', 100, 5, new Date());
  store.add('B', 200, 10, new Date());
  store.clear();
  eq(store.getAll().length, 0, 'empty after clear');
});

run('getAll() returns a copy, not the internal array', () => {
  const store = createDrinkStore(() => {});
  store.add('A', 100, 5, new Date());
  const copy = store.getAll();
  copy.push({ name: 'X', vol: 1, abv: 1, time: new Date() });
  eq(store.getAll().length, 1, 'internal unchanged');
});
