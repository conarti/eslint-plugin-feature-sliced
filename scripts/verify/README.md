# Verification checks

Three guards that compare a test run against a recorded baseline. They were written for the
2026-09-15 test suite refactor and are kept here so every gate can be rerun later. All three are
run from the repo root and read and write `reports/verify/`, which is gitignored, so the baselines
live on the machine that captured them and never reach a commit.

## The checks

| Script | Command | What it does |
|--------|---------|--------------|
| `check-t.cjs` | `npm run verify:tests` | Diffs test names. Reads `reports/verify/tests-before.json` and `reports/verify/tests-after.json`, prints the totals plus a `removed` and an `added` block. A rename shows as one removed and one added line. Writes nothing. |
| `check-c.cjs` | `npm run verify:coverage` | Per-file branch coverage guard. Reads `reports/verify/cov-before/coverage-summary.json` and `reports/verify/cov-after/coverage-summary.json`, fails on any per-file branch drop, on a vanished file (`FILE GONE`), or when the totals fall below the recorded baseline. Writes nothing, exits nonzero on failure. |
| `check-m.cjs` | `npm run verify:mutation` | Mutation guard. Reads `reports/mutation/mutation.json` and `reports/verify/floors.json`, and on a passing run rewrites `floors.json` with the measured scores. Exits 1 on a broken floor and 2 when the run reported timeouts, which means the run is discarded and repeated. |

`check-m.cjs` reads two environment variables: `ADVANCE_BACKSTOP=1` makes the passing run write its
own score as the new backstop, and `STEP` records which step did that. Leave both unset for a normal
run.

## Capturing the baselines

The "before" side of each check is produced by the same commands, pointed at the `before` paths:

```bash
mkdir -p reports/verify
npx vitest run --coverage.enabled=false --reporter=default --reporter=json --outputFile=reports/verify/tests-before.json
npx vitest run --coverage.reporter=json-summary --coverage.reportsDirectory=reports/verify/cov-before
npx stryker run --incremental --force 2>&1 | tee reports/verify/mutation-before.txt
cp reports/mutation/mutation.json reports/verify/mutation-before.json
```

With `reports/verify/floors.json` absent, the first `npm run verify:mutation` seeds it from the run
it just measured and prints `seeded`. The file is never edited by hand.

The "after" side of a later run uses `--outputFile=reports/verify/tests-after.json` and
`--coverage.reportsDirectory=reports/verify/cov-after`. Once a change is accepted, advance the test
baseline with `cp reports/verify/tests-after.json reports/verify/tests-before.json`. The coverage
baseline is deliberately not advanced, so coverage cannot erode one tolerable step at a time.

## The floor rule

A run passes `check-m.cjs` when its `All files` score is at or above both the previous accepted
score minus 0.3 and the backstop minus 0.3. The 0.3 band absorbs run to run noise between
neighbouring runs, while the backstop is checked independently every time so a long sequence of
small losses cannot drift below it.
