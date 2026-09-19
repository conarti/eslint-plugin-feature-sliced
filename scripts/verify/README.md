# Verification checks

Three guards that compare a test run against a recorded baseline. They were written for the
2026-09-15 test suite refactor and are kept here so every gate can be rerun later. All three are
run from the repo root.

The test and coverage baselines live in `reports/verify/`, which is gitignored, so they stay on the
machine that captured them. The mutation floors are different: they are committed, in
`scripts/verify/mutation-floors.json`, because the `Mutation testing` workflow runs that guard on
every pull request and a clean checkout has to have something to compare against.

## The checks

| Script | Command | What it does |
|--------|---------|--------------|
| `check-t.cjs` | `npm run verify:tests` | Diffs test names. Reads `reports/verify/tests-before.json` and `reports/verify/tests-after.json`, prints the totals plus a `removed` and an `added` block. A rename shows as one removed and one added line. Writes nothing. |
| `check-c.cjs` | `npm run verify:coverage` | Per-file branch coverage guard. Reads `reports/verify/cov-before/coverage-summary.json` and `reports/verify/cov-after/coverage-summary.json`, fails on any per-file branch drop, on a vanished file (`FILE GONE`), or when the totals fall below the recorded baseline. Writes nothing, exits nonzero on failure. |
| `check-m.cjs` | `npm run verify:mutation` | Mutation guard. Reads `reports/mutation/mutation.json` and the committed `scripts/verify/mutation-floors.json`, and compares the run against the overall floor, the backstop and every per-file floor. Writes nothing unless asked. Exits 1 on a broken floor or a missing floors file. |

`check-m.cjs` writes the floors file only when asked, through one of three environment variables:

- `ADVANCE_FLOORS=1` records a passing run: every per-file floor and the overall score move to what
  that run measured, and the backstop is left where it was. This is the everyday one.
- `ADVANCE_BACKSTOP=1` does the same and moves the backstop up to that run's score as well. Pair it
  with `STEP`, which is free text stored as `backstopSetBy` so the file says what moved it.
- `SEED_FLOORS=1` writes the whole file from the current run without comparing against the old one,
  backstop included. This is the reset, and the only way the backstop comes back down.

Leave all of them unset for a normal run, which is what the workflow does: it reads the floors and
never touches them.

A missing floors file is a failure, not a first run. The file ships with the repository, so its
absence means a broken checkout rather than a machine that has not measured yet.

## Capturing the baselines

The "before" side of each check is produced by the same commands, pointed at the `before` paths:

```bash
mkdir -p reports/verify
npx vitest run --coverage.enabled=false --reporter=default --reporter=json --outputFile=reports/verify/tests-before.json
npx vitest run --coverage.reporter=json-summary --coverage.reportsDirectory=reports/verify/cov-before
npx stryker run --incremental --force 2>&1 | tee reports/verify/mutation-before.txt
cp reports/mutation/mutation.json reports/verify/mutation-before.json
```

`scripts/verify/mutation-floors.json` is not captured that way, because it is already in the
repository. It is never edited by hand either: the three environment variables above are the only
things that write it, and the result is reviewed as a diff like any other change.

The "after" side of a later run uses `--outputFile=reports/verify/tests-after.json` and
`--coverage.reportsDirectory=reports/verify/cov-after`. Once a change is accepted, advance the test
baseline with `cp reports/verify/tests-after.json reports/verify/tests-before.json`. The coverage
baseline is deliberately not advanced, so coverage cannot erode one tolerable step at a time.

## The floor rule

A run passes `check-m.cjs` when its `All files` score is at or above both the previous accepted
score minus 0.3 and the backstop minus 0.3, and every per-file floor is met with the same 0.3 band.
The 0.3 band absorbs run to run noise between neighbouring runs, while the backstop is checked
independently every time so a long sequence of small losses cannot drift below it.

A file listed in the floors that the run did not measure is reported as `FILE GONE` and fails. That
is the intended behaviour when coverage vanishes, and it is also what a rename looks like, so a pull
request that renames a mutated source file has to advance the floors and commit them.

## Timeouts

A timeout counts as a detected mutant, the same as a kill, so a timeout can only raise a score and
never lower one. It therefore cannot break a floor, and the guard does not fail a run over one. It
prints a warning instead, because the score is then an upper bound and a real loss can hide behind
it.

Recording such a run as the new baseline is refused, with exit code 2. An inflated number written
into the floors would have to be held by every later run, which is how a gate starts failing for
reasons that have nothing to do with the code.
