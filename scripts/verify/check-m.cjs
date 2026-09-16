/*
 * Extracted from .omc/plans/2026-09-15-test-suite-refactor.md, lines 255-310
 * (check M: the mutation guard, plus "The floor rule" on lines 231-239 and
 * "Floors are persisted, not hand-carried" on lines 241-251).
 *
 * The plan defines this as a `node -e` snippet run from the repo root, where
 * relative paths resolve against process.cwd(). This file is a real module,
 * so the paths below are resolved explicitly against the repo root instead
 * (FLOORS_PATH stays in reports/verify/; mutation.json is read from
 * reports/mutation/). The seeding path, env handling (ADVANCE_BACKSTOP,
 * STEP), timeout discard, FILE GONE handling and printed strings are
 * unchanged.
 *
 * Run from the repo root as: npm run verify:mutation
 * Step 8 only: ADVANCE_BACKSTOP=1 STEP='step 8' npm run verify:mutation
 */
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const REPORTS_DIR = path.resolve(process.cwd(), 'reports/verify');

const FLOORS_PATH = path.join(REPORTS_DIR, 'floors.json');
const LITERAL_FALLBACK = {
  backstop: 74.61,
  overall: 74.61,
  files: {
    'src/lib/rule/extract-segments-config.ts': 36.84,
    'src/rules/absolute-relative/index.ts': 45.0,
    'src/rules/public-api/index.ts': 51.16,
    'src/rules/public-api/model/is-unknown-segment.ts': 64.79,
    'src/lib/feature-sliced/extract-slice.ts': 72.86,
  },
};

const seeding = !fs.existsSync(FLOORS_PATH);
const prev = seeding ? LITERAL_FALLBACK : JSON.parse(fs.readFileSync(FLOORS_PATH, 'utf8'));
if (seeding)
  console.log('NOTE: floors.json absent, seeding from this run (expected only at step 1b)');

const j = require(path.resolve(process.cwd(), 'reports/mutation/mutation.json'));
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
  seeding ? 'n/a (seeding)' : prev.overall.toFixed(2),
  '| backstop',
  seeding ? 'n/a (seeding)' : `${prev.backstop.toFixed(2)} set by ${prev.backstopSetBy || 'unknown'}`,
);
let bad = 0;
if (!seeding) {
  if (overall < prev.overall - 0.3) {
    bad++;
    console.log('FAIL All files below previous', overall.toFixed(2), '<', (prev.overall - 0.3).toFixed(2));
  }
  if (overall < prev.backstop - 0.3) {
    bad++;
    console.log('FAIL All files below backstop', overall.toFixed(2), '<', (prev.backstop - 0.3).toFixed(2));
  }
}
const measured = {};
for (const [f, d] of Object.entries(j.files)) {
  const s = pct(d.mutants);
  if (s !== null)
    measured[f] = Number(s.toFixed(2));
}
for (const [f, floor] of Object.entries(prev.files)) {
  if (seeding)
    break;
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
if (timeouts > 0) {
  console.log('DISCARD: nonzero timeout column, re-run before this result counts');
  process.exit(2);
}
if (bad === 0) {
  const advance = seeding || process.env.ADVANCE_BACKSTOP === '1';
  const next = {
    backstop: advance ? Number(overall.toFixed(2)) : prev.backstop,
    backstopSetBy: advance ? process.env.STEP || (seeding ? 'step 1b' : 'unnamed step') : prev.backstopSetBy,
    overall: Number(overall.toFixed(2)),
    files: measured,
  };
  fs.writeFileSync(FLOORS_PATH, `${JSON.stringify(next, null, 2)}\n`);
  if (seeding)
    console.log(`OK: seeded; backstop and overall set to ${next.backstop}`);
  else if (advance)
    console.log(`OK: mutation floors held; backstop advanced to ${next.backstop}; floors.json advanced`);
  else console.log('OK: mutation floors held; floors.json advanced');
}
else {
  console.log(`FAIL: ${bad} floor(s) broken; floors.json left untouched`);
}
process.exit(bad ? 1 : 0);
