# tests/repro/

This directory contains bug reproduction tests.

Naming convention: `YYYY-MM-DD-bug-slug.test.js`

Each file should:
1. Import the relevant module(s)
2. Reproduce the exact conditions that triggered the bug
3. Assert the correct behavior after the fix

These tests are loaded by the test runner alongside integration tests.
