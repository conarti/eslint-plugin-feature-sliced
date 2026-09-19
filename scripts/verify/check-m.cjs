/*
 * Extracted from .omc/plans/2026-09-15-test-suite-refactor.md, lines 255-310
 * (check M: the mutation guard, plus "The floor rule" on lines 231-239 and
 * "Floors are persisted, not hand-carried" on lines 241-251).
 *
 * The plan defines this as a `node -e` snippet run from the repo root, where
 * relative paths resolve against process.cwd(). This file is a real module,
 * so the paths below are resolved explicitly against the repo root instead.
 *
 * Three things depart from the plan, so that the same guard can run on a
 * pull request and not only on the machine that captured the floors.
 *
 * 1. The floors are committed. The plan kept them in reports/verify/, which
 *    is gitignored, so a clean clone had nothing to compare against. They now
 *    live in mutation-floors.json beside this file. reports/ is generated
 *    output that gets deleted to clean the tree, which is the wrong place for
 *    a file that has to survive.
 * 2. A missing floors file fails. The plan seeded from the run it had just
 *    measured whenever the file was absent, which on a clean clone meant the
 *    guard accepted any score at all. Seeding is now an explicit request,
 *    SEED_FLOORS=1, and so is advancing, ADVANCE_FLOORS=1 or ADVANCE_BACKSTOP=1.
 *    A run that asks for none of them only reads.
 * 3. A timeout no longer discards the comparison, it only blocks a write. A
 *    timeout is counted as a detected mutant, so it can raise a score and
 *    never lower one. It therefore cannot break a floor, and failing the run
 *    over one would fail pull requests for load on the runner rather than for
 *    anything about the code. It can still hide a real loss behind an
 *    inflated number, so the run says so, and recording such a run as the new
 *    baseline is still refused.
 *
 * Run from the repo root as: npm run verify:mutation
 * Advance the floors, backstop untouched: ADVANCE_FLOORS=1 npm run verify:mutation
 * Advance the floors and the backstop: ADVANCE_BACKSTOP=1 STEP='<why>' npm run verify:mutation
 * Reset the whole file to this run: SEED_FLOORS=1 STEP='<why>' npm run verify:mutation
 */
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const ROOT = process.cwd();
const FLOORS_PATH = path.join(ROOT, 'scripts/verify/mutation-floors.json');
const FLOORS_LABEL = path.relative(ROOT, FLOORS_PATH);

/*
 * The plan let a plain passing run rewrite the floors, and kept ADVANCE_BACKSTOP
 * for the separate question of whether the backstop moved with them. With the
 * floors committed, a write has to be asked for, so the plain run's old effect
 * gets a name of its own, ADVANCE_FLOORS, and ADVANCE_BACKSTOP keeps meaning what
 * it meant: the same write, and the backstop moves too.
 */
const seeding = process.env.SEED_FLOORS === '1';
const advancingBackstop = process.env.ADVANCE_BACKSTOP === '1';
const advancing = advancingBackstop || process.env.ADVANCE_FLOORS === '1';
const writing = seeding || advancing;

if (!seeding && !fs.existsSync(FLOORS_PATH)) {
  console.log(`FAIL: no mutation floors at ${FLOORS_LABEL}`);
  console.log('The floors are committed, so an absent file is a broken checkout, not a first run.');
  console.log("To record this run as the baseline on purpose: SEED_FLOORS=1 STEP='<why>' npm run verify:mutation");
  process.exit(1);
}

const prev = seeding && !fs.existsSync(FLOORS_PATH) ? null : JSON.parse(fs.readFileSync(FLOORS_PATH, 'utf8'));

const j = require(path.resolve(ROOT, 'reports/mutation/mutation.json'));
function pct(ms) {
  const d = ms.filter((m) => m.status === 'Killed' || m.status === 'Timeout').length;
  const u = ms.filter((m) => m.status === 'Survived' || m.status === 'NoCoverage').length;
  return d + u === 0 ? null : (d / (d + u)) * 100;
}
const all = Object.values(j.files).flatMap((d) => d.mutants);
const timeouts = all.filter((m) => m.status === 'Timeout').length;
const overall = pct(all);
console.log('All files', overall.toFixed(2), '| mutants', all.length, '| killed', all.filter((m) => m.status === 'Killed').length, '| timeouts', timeouts);
console.log(
  'previous',
  prev ? prev.overall.toFixed(2) : 'n/a (seeding)',
  '| backstop',
  prev ? `${prev.backstop.toFixed(2)} set by ${prev.backstopSetBy || 'unknown'}` : 'n/a (seeding)',
);

if (timeouts > 0) {
  if (writing) {
    console.log(`DISCARD: ${timeouts} timeout(s), refusing to record a baseline from this run; re-run first`);
    process.exit(2);
  }
  console.log(`WARNING: ${timeouts} timeout(s). A timeout counts as detected, so the score above is an`);
  console.log('upper bound and a real loss can hide behind it. The floors are still checked, because a');
  console.log('timeout can only raise a score and so can never break one on its own.');
}

const measured = {};
for (const [f, d] of Object.entries(j.files)) {
  const s = pct(d.mutants);
  if (s !== null)
    measured[f] = Number(s.toFixed(2));
}

function write(backstop, backstopSetBy) {
  /*
   * Sorted by path, because the report hands the files over in whatever order it
   * walked them and that order changes between runs. Unsorted, regenerating the
   * committed file moves lines around without changing a single score, which
   * buries the one number that did move.
   */
  const files = {};
  for (const f of Object.keys(measured).sort())
    files[f] = measured[f];
  const next = { backstop, backstopSetBy, overall: Number(overall.toFixed(2)), files };
  fs.writeFileSync(FLOORS_PATH, `${JSON.stringify(next, null, 2)}\n`);
}

if (seeding) {
  write(Number(overall.toFixed(2)), process.env.STEP || 'unnamed step');
  console.log(`OK: seeded ${FLOORS_LABEL}; backstop and overall set to ${overall.toFixed(2)}; commit it`);
  process.exit(0);
}

let bad = 0;
if (overall < prev.overall - 0.3) {
  bad++;
  console.log('FAIL All files below previous', overall.toFixed(2), '<', (prev.overall - 0.3).toFixed(2));
}
if (overall < prev.backstop - 0.3) {
  bad++;
  console.log('FAIL All files below backstop', overall.toFixed(2), '<', (prev.backstop - 0.3).toFixed(2));
}
for (const [f, floor] of Object.entries(prev.files)) {
  if (measured[f] === undefined) {
    console.log('FILE GONE', f);
    bad++;
    continue;
  }
  const ok = measured[f] >= floor - 0.3;
  if (!ok) {
    bad++;
    console.log('FAIL', f, measured[f].toFixed(2), `(floor ${floor})`);
  }
}

if (bad > 0) {
  console.log(`FAIL: ${bad} floor(s) broken; ${FLOORS_LABEL} left untouched`);
  console.log('Either the change lost mutation coverage, or a mutated file was renamed or deleted.');
  console.log(`If the new numbers are the ones to keep: ADVANCE_FLOORS=1 npm run verify:mutation, then commit ${FLOORS_LABEL}`);
  process.exit(1);
}

if (advancing) {
  if (advancingBackstop) {
    write(Number(overall.toFixed(2)), process.env.STEP || 'unnamed step');
    console.log(`OK: mutation floors held; floors and backstop advanced to ${overall.toFixed(2)}; commit ${FLOORS_LABEL}`);
  }
  else {
    write(prev.backstop, prev.backstopSetBy);
    console.log(`OK: mutation floors held; floors advanced, backstop left at ${prev.backstop.toFixed(2)}; commit ${FLOORS_LABEL}`);
  }
}
else {
  console.log(`OK: mutation floors held; ${FLOORS_LABEL} unchanged`);
}
process.exit(0);
