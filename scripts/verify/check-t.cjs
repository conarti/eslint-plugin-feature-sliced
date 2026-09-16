/*
 * Extracted from .omc/plans/2026-09-15-test-suite-refactor.md, lines 171-190
 * (check T: test-name diff).
 *
 * The plan defines this as a `node -e` snippet run from the repo root, where
 * relative require() paths resolve against process.cwd(). This file is a
 * real module, so the paths below are resolved explicitly against the repo
 * root instead; they still point at reports/verify/tests-before.json and
 * reports/verify/tests-after.json. The comparison logic and printed strings
 * are unchanged.
 *
 * Run from the repo root as: npm run verify:tests
 */
const path = require('node:path');
const process = require('node:process');

const REPORTS_DIR = path.resolve(process.cwd(), 'reports/verify');

function load(f) {
  const j = require(path.join(REPORTS_DIR, f));
  const seen = new Map();
  const keys = [];
  for (const r of j.testResults) {
    for (const a of r.assertionResults) {
      const base = `${r.name.replace(/^.*eslint-plugin-feature-sliced\//, '')} :: ${a.fullName}`;
      const n = (seen.get(base) || 0) + 1;
      seen.set(base, n);
      keys.push(n === 1 ? base : `${base} #${n}`);
    }
  }
  return { set: new Set(keys), reported: j.numTotalTests, collected: keys.length };
}

const b = load('tests-before.json');
const a = load('tests-after.json');
console.log('numTotalTests before', b.reported, 'after', a.reported);
console.log('keys before', b.collected, 'after', a.collected);
if (b.reported !== b.collected || a.reported !== a.collected)
  console.log('WARNING: key count disagrees with numTotalTests');
const removed = [...b.set].filter((x) => !a.set.has(x));
const added = [...a.set].filter((x) => !b.set.has(x));
console.log('removed', removed.length);
removed.forEach((x) => console.log('  -', x));
console.log('added', added.length);
added.forEach((x) => console.log('  +', x));
