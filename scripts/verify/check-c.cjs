/*
 * Extracted from .omc/plans/2026-09-15-test-suite-refactor.md, lines 209-224
 * (check C: per-file branch coverage guard, compared against the step 1b
 * baseline, never against the previous step).
 *
 * The plan defines this as a `node -e` snippet run from the repo root, where
 * relative require() paths resolve against process.cwd(). This file is a
 * real module, so the paths below are resolved explicitly against the repo
 * root instead; they still point at
 * reports/verify/cov-before/coverage-summary.json and
 * reports/verify/cov-after/coverage-summary.json. The comparison logic,
 * thresholds and printed strings are unchanged.
 *
 * Run from the repo root as: npm run verify:coverage
 */
const path = require('node:path');
const process = require('node:process');

const REPORTS_DIR = path.resolve(process.cwd(), 'reports/verify');

const b = require(path.join(REPORTS_DIR, 'cov-before/coverage-summary.json'));
const a = require(path.join(REPORTS_DIR, 'cov-after/coverage-summary.json'));
let bad = 0;
for (const k of Object.keys(b)) {
  if (k === 'total')
    continue;
  const short = k.replace(/^.*eslint-plugin-feature-sliced\//, '');
  if (!a[k]) {
    console.log('FILE GONE', short);
    bad++;
    continue;
  }
  if (a[k].branches.pct < b[k].branches.pct) {
    bad++;
    console.log('BRANCH DROP', short, b[k].branches.pct, '->', a[k].branches.pct);
  }
}
if (a.total.lines.pct < 97.23) {
  bad++;
  console.log('TOTAL LINES BELOW BASELINE', a.total.lines.pct);
}
if (a.total.branches.pct < 92.33) {
  bad++;
  console.log('TOTAL BRANCHES BELOW BASELINE', a.total.branches.pct);
}
console.log('total lines', b.total.lines.pct, '->', a.total.lines.pct, '| branches', b.total.branches.pct, '->', a.total.branches.pct);
console.log(bad === 0 ? 'OK: no per-file branch coverage drop' : `FAIL: ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
