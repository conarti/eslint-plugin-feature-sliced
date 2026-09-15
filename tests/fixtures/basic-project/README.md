# `basic-project` fixture

## Purpose

This directory is a small, deliberately broken FSD project kept on disk so that
`tests/integration/fixture-project.test.ts` can run the real ESLint 9 `ESLint` class over it
with the plugin built from `src` and compare the whole report with the committed
`expected.json`.

It is the trust anchor for the plugin's behavior. The rule test suites in `src/rules/**/*.test.ts`
exercise each rule in isolation through `RuleTester`, with hand-written code strings and
hand-written settings. This fixture instead proves that the plugin factory, the settings it
writes, the rule wiring, the message ids and the suggestions still behave as a whole on a real
file tree resolved from a real working directory. If a refactor breaks the plumbing without
breaking any unit test, this is the test that catches it.

## The two subtrees

The fixture holds two independent projects, each linted with its own configuration.

| Subtree | Config | What it covers |
|---------|--------|----------------|
| `src/` | `featureSliced()` | The default options: one violation per rule and per message id, plus valid files that prove there are no false positives |
| `src2/` | `featureSliced({ publicApi: { level: 'segments' }, segments: ['services'] })` | The `unknown-segment` message id, the custom `services` segment, and the cross-import exemption at the segments level |

Imports inside the fixture do not need to resolve to anything: the rules only look at import
paths, never at the module the path points to.

## Shape of an `expected.json` entry

`expected.json` is a flat array of normalized messages. One entry looks like this:

```json
{
  "file": "src/entities/user/model/index.ts",
  "ruleId": "@conarti/feature-sliced/no-cross-segment-reexport",
  "messageId": "no-cross-segment-reexport",
  "line": 2,
  "column": 27,
  "suggestions": [
    "move-to-slice-public-api-suggestion"
  ]
}
```

`file` is a POSIX path relative to this directory, `ruleId` and `messageId` come straight from
the ESLint message, `line` and `column` are 1-based, and `suggestions` lists the message id of
every suggestion the rule attached, in the order the rule produced them. The array is sorted by
file, line, column, rule id and message id, using a code-point comparison so the order does not
depend on the machine's locale.

## What every expectation proves

| File | Rule | Message id | What this proves |
|------|------|------------|------------------|
| `src/entities/index.ts` | `public-api` | `layers-public-api-not-allowed` | A layer must not have its own public api: an `index.ts` sitting directly on the `entities` layer and re-exporting a slice is a violation |
| `src/entities/product/model/invalid-cross-import.ts` | `layers-slices` | `invalid-cross-import` | An `@x` cross-import is addressed to one specific slice, so `.../session/@x/user` may not be consumed from the `product` slice |
| `src/entities/user/model/dynamic-upward-import.ts` | `layers-slices` | `can-not-import` | The layer check also inspects dynamic `import()` expressions, not only static import declarations |
| `src/entities/user/model/imports-features-upward.ts` | `layers-slices` | `can-not-import` | A lower layer may not import an upper one: `entities` importing `features` is a violation |
| `src/entities/user/model/index.ts` | `no-cross-segment-reexport` | `no-cross-segment-reexport` (suggestion `move-to-slice-public-api-suggestion`) | A segment must not re-export another segment of the same slice: the `model` segment re-exporting from `../api` is a violation, and the rule attaches a suggestion that rewrites the path to the slice public api |
| `src/entities/user/ui/absolute-inside-slice.ts` | `absolute-relative` | `must-be-relative-path` | An import that stays inside a single slice has to be written as a relative path |
| `src/pages/home/ui/deep-import-into-slice.ts` | `public-api` | `should-be-from-public-api` (suggestion `remove-suggestion`) | Another slice may only be reached through its public api, never by a deep import into one of its segments, and the rule attaches a suggestion that strips the deep part of the path |
| `src/widgets/header/ui/relative-cross-layer-import.ts` | `absolute-relative` | `must-be-absolute-path` | An import that crosses a layer boundary has to be written as an absolute path |
| `src/widgets/header/ui/wrong-import-order.ts` | `import-order` | `order` | External packages are ordered before FSD layer imports, so an `axios` import placed after a layer import is reported |
| `src2/features/checkout/ui/unknown-segment-import.ts` | `public-api` | `unknown-segment` | At `publicApi.level: 'segments'`, a folder in segment position that is not in the configured segment list (`helpers`) is reported instead of being silently accepted |

Alongside the snapshot the test asserts that every rule id the plugin exports still appears
somewhere in the report, so a preset that silently stops enabling a rule fails the suite, and
that the number of linted files matches the number of `.ts` files actually present here, so a
lint glob that quietly stops matching a subtree fails too.

## The clean files

The remaining 25 `.ts` files carry no expectation at all, and the test asserts that they produce
no message whatsoever. They are the false-positive guard: correct upward type-only imports,
relative imports inside a slice, absolute imports across layers, slice and segment public apis,
`@x` cross-imports addressed to the importing slice, and the custom `services` segment of `src2/`
all have to stay silent. `src2/entities/basket/model/cross-import-at-segments-level.ts` is the one
worth naming: it keeps the `@x` cross-import exempt from the `unknown-segment` check when
`publicApi.level` is `'segments'`. A rule that starts over-reporting shows up here, not in the snapshot.

## Updating `expected.json`

```bash
UPDATE_FIXTURE_EXPECTATIONS=1 npx vitest run tests/integration
```

The run rewrites `expected.json` from the current lint report and then fails on purpose, so a
regenerated snapshot can never be mistaken for a passing suite. Review the diff line by line,
then re-run the suite without the flag to confirm it passes. Adding, renaming or editing any
fixture file changes the snapshot, so this is the required workflow for every fixture change.

## Why this directory is excluded from the tooling

The files here are intentionally broken and intentionally unstyled, so the repo's own tooling has
to skip them.

- `eslint.config.mjs` ignores `tests/fixtures/**`, because `npm run lint` would otherwise report
  the very violations the fixture exists to produce.
- `tsconfig.json` excludes `tests/fixtures`, because the fixture imports are deliberately
  unresolvable and would fail `npm run type-check`.
- `vitest.config.ts` excludes `**/tests/fixtures/**` from coverage, because the fixture is test
  input rather than plugin source and would otherwise distort the coverage report.
