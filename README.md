# @conarti/eslint-plugin-feature-sliced

ESLint rules that keep a codebase inside the boundaries of Feature-Sliced Design.

[![npm version](https://img.shields.io/npm/v/@conarti/eslint-plugin-feature-sliced.svg)](https://www.npmjs.com/package/@conarti/eslint-plugin-feature-sliced)
[![npm downloads](https://img.shields.io/npm/dm/@conarti/eslint-plugin-feature-sliced.svg)](https://www.npmjs.com/package/@conarti/eslint-plugin-feature-sliced)
[![CI](https://github.com/conarti/eslint-plugin-feature-sliced/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/conarti/eslint-plugin-feature-sliced/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@conarti/eslint-plugin-feature-sliced.svg)](https://www.npmjs.com/package/@conarti/eslint-plugin-feature-sliced)

[Feature-Sliced Design](https://fsd.how/) splits a frontend into layers, slices and
segments, and most of the methodology comes down to rules about which file may import which other
file. This plugin enforces those rules.

The four FSD rules only read import and export paths. They never resolve a module and never need
type information, so they work with any framework, any bundler and any alias scheme: `~/shared/ui`,
`@/shared/ui`, `@shared/ui`, `$shared/ui` and `src/shared/ui` are all understood out of the box.
The bundled import sorting preset is a different matter: it is the `order` rule of
`eslint-plugin-import-x`, which does resolve modules and follows your `import-x/resolver` settings.

Version 2 is a flat-config plugin. The default export is a factory that returns one ready config
object, so a whole FSD setup is a single call.

## Requirements

| Requirement | Value |
| - | - |
| ESLint | 9 or newer, flat config only (`eslint.config.js`) |
| Node.js | `^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0` |

Still on ESLint 8 or on a legacy `.eslintrc` file? Stay on the 1.x line, which is unchanged and
still published:

```sh
npm i -D @conarti/eslint-plugin-feature-sliced@1
```

## Installation

```sh
npm i -D eslint @conarti/eslint-plugin-feature-sliced
```

Nothing else is needed for a JavaScript project. The import sorting preset is built on the `order`
rule of [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x), which ships as
a dependency of this package. A TypeScript project needs a TypeScript-aware parser on top, as it
would for any other rule; see the next section.

## Quick start

`eslint.config.js` (ESM, the default when `package.json` has `"type": "module"`):

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

`eslint.config.cjs` (CommonJS). `require` of this package returns the factory itself:

```js
const featureSliced = require('@conarti/eslint-plugin-feature-sliced');

module.exports = [
  featureSliced(),
];
```

A TypeScript project. The plugin needs no type information, but TypeScript files still need a
TypeScript-aware parser, exactly as they would for any other rule. That parser is part of your
normal setup, not a requirement of this plugin, so the helper you already use works too, including
the `tseslint.config` helper from the `typescript-eslint` package. The example below uses the
parser on its own, so install it first:

```sh
npm i -D @typescript-eslint/parser
```

```js
import tsParser from '@typescript-eslint/parser';
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
  },
  featureSliced(),
];
```

`featureSliced()` returns a plain flat-config object with `name`, `plugins`, `settings` and
`rules`, and no `files` key, so it applies to everything ESLint lints. Spread it to add `files` or
any other key and scope it to your source tree:

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  {
    ...featureSliced(),
    files: ['src/**/*.{ts,tsx}'],
  },
];
```

## What the plugin checks

Every example below is taken from `tests/fixtures/basic-project`, the FSD tree the test suite lints
end to end on every run. Its layout:

```text
src/
  shared/
    lib/format-date.ts
  entities/
    product/
      model/
    session/
      model/
      index.ts
    user/
      api/
      model/
      ui/
      index.ts
    index.ts
  features/
    auth/
      model/
      index.ts
    profile/
      model/
  widgets/
    header/
      ui/
      index.ts
  pages/
    home/
      ui/
      index.ts
  app/
    providers/router.ts
src2/
  entities/
    basket/model/
    cart/
      services/
      ui/
  features/
    checkout/ui/
```

`src/` is linted with the plain defaults. `src2/` is a second tree, linted with
`publicApi: { level: 'segments' }` and `segments: ['services']`, and it covers the segment-level
checks and the custom segment name. `src/entities/index.ts` is there on purpose: it is the
violation quoted under [Public API](#public-api).

### Layers and slices

A file may import only from layers below its own. Imports between two slices of one layer are
reported as well, unless they use the `@x` notation described further down. Imports inside a single
slice, and imports inside a layer that has no slices, are left alone.

Incorrect, `src/entities/user/model/imports-features-upward.ts`:

```ts
import { loginUser } from 'src/features/auth';
```

> You cannot import layer "features" into "entities" (shared -> entities -> features -> widgets -> pages -> processes -> app)

Correct, `src/features/auth/model/uses-entities-public-api.ts`:

```ts
import { createUser } from 'src/entities/user';
```

Type-only imports are exempt by default, so an upward `import type` stays valid,
`src/entities/user/model/type-only-upward-import.ts`:

```ts
import type { AuthState } from 'src/features/auth';
```

Dynamic `import()` expressions are checked too.

### Absolute and relative paths

Inside one slice, or inside a layer without slices, imports have to be relative. Across layers they
have to be absolute.

Incorrect, `src/entities/user/ui/absolute-inside-slice.ts`:

```ts
import { createUser } from 'src/entities/user/model/create-user';
```

> There must be relative paths

Incorrect, `src/widgets/header/ui/relative-cross-layer-import.ts`:

```ts
import { createUser } from '../../../entities/user';
```

> There must be absolute paths

Correct, `src/entities/user/ui/user-card.ts` and `src/pages/home/ui/home-page.ts`:

```ts
import { createUser } from '../model/create-user';
```

```ts
import { Header } from 'src/widgets/header';
```

### Public API

Another slice may only be reached through its own `index` file. How deep the check goes depends on
`level`. At the default `'slices'` the rule reports an import that reaches into a known segment of
another slice. A file sitting directly in the slice root, outside any segment (an import of
`src/entities/user/helper`, say, which the fixture does not contain), is not reported at that
level; at `level: 'segments'` it is, as an `unknown-segment`.

Incorrect, `src/pages/home/ui/deep-import-into-slice.ts`:

```ts
import { UserCard } from 'src/entities/user/ui/user-card';
```

> Absolute imports are only allowed from public api ("src/entities/user")

The rule attaches a suggestion, `Remove the "ui/user-card"`, that rewrites the path to
`src/entities/user`.

A layer itself must not have a public API, so an `index` file sitting directly on a layer is
reported whatever it contains. Incorrect, `src/entities/index.ts`:

```ts
export { createUser } from './user';
```

> The layer public API is not allowed. It harms both architecturally and practically (code splitting)

### Cross-segment re-exports

One segment of a slice must not re-export from a sibling segment. Only re-export statements
(`export { x } from '...'`, `export type { x } from '...'`, `export * from '...'`) are looked at.

Incorrect, `src/entities/user/model/index.ts`:

```ts
export { fetchUser } from '../api';
```

> Segment "model" should not re-export from sibling segment "api". Move the re-export to the slice public API.

The suggestion rewrites `'../api'` to `'..'`, the slice public API.

Correct, `src/entities/session/index.ts` and `src/entities/session/model/index.ts`:

```ts
export { sessionToken } from './model';
```

```ts
export { sessionToken } from './session-token';
```

### Import order

External packages come before layer imports, and layers are sorted from the top of the hierarchy
down to `shared`.

Incorrect, `src/widgets/header/ui/wrong-import-order.ts`:

```ts
import { createUser } from 'src/entities/user';
import axios from 'axios';
```

> `axios` import should occur before import of `src/entities/user`

Correct:

```ts
import axios from 'axios';
import { createUser } from 'src/entities/user';
```

## Configuration

### Factory options

```js
featureSliced(options);
```

| Option | Type | Default | What it does |
| - | - | - | - |
| `severity` | `'error'` or `'warn'` | `'error'` | Severity for the four FSD rules. Each rule can override it. The import sorting preset is not affected: it always carries `error`. |
| `layers` | array of `string` or `{ name, hasSlices }` | `shared` (no slices), `entities`, `features`, `widgets`, `pages`, `processes`, `app` (no slices). `processes` is kept for compatibility although the FSD spec deprecates it. | The layer hierarchy, lowest first. |
| `segments` | `string[]` or `{ replace: string[] }` | `ui`, `model`, `lib`, `api`, `config`, `assets` | Segment names. An array extends the defaults, `{ replace }` replaces them. |
| `layersSlices` | `false` or options object | `{}` (rule on) | Options for `layers-slices`. |
| `absoluteRelative` | `false` or options object | `{}` (rule on) | Options for `absolute-relative`. |
| `publicApi` | `false` or options object | `{}` (rule on) | Options for `public-api`. |
| `noCrossSegmentReexport` | `false` or options object | `{}` (rule on) | Options for `no-cross-segment-reexport`. |
| `sortImports` | `false`, `'recommended'`, `'with-newlines'`, `'with-type-group'`, `'with-newlines-and-type-group'` | `'recommended'` | Which import sorting preset to enable, or `false` to leave the entry out entirely. |

Layer and segment names are compared case-insensitively.

### Per-rule options

Each rule accepts the keys marked for it below. A key a rule does not know is a type error in
TypeScript, and silently ignored in JavaScript, because the rule schemas do not close themselves
off with `additionalProperties: false`.

| Option | Rules | Type | Default | What it does |
| - | - | - | - | - |
| `severity` | all four | `'error'` or `'warn'` | the factory `severity` | Severity for this rule only. |
| `ignoreImports` | all four | `string[]` | `[]` | Skip imports whose specifier matches one of these globs. |
| `ignoreFiles` | all four | `string[]` | `[]` | Skip files whose path matches one of these globs. |
| `allowTypeImports` | `layers-slices` | `boolean` | `true` | Exempt type-only imports from the layer check. |
| `level` | `public-api` | `'slices'` or `'segments'` | `'slices'` | How deep the public API check goes. |

A worked example:

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    severity: 'warn',
    publicApi: {
      severity: 'error',
      level: 'segments',
    },
    layersSlices: {
      allowTypeImports: false,
    },
  }),
];
```

### Severity

`severity` sets the level of `layers-slices`, `absolute-relative`, `public-api` and
`no-cross-segment-reexport` at once; a rule's own `severity` wins over it. While migrating an
existing codebase, `'warn'` keeps the build green and still surfaces every violation.

The import sorting preset always carries `error`, because the preset is a complete rule entry
rather than a set of options. To change its level, add a later config object that overrides only
the severity. ESLint flat config keeps the options of the earlier entry in that case, so the preset
stays intact:

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
  {
    rules: {
      '@conarti/feature-sliced/import-order': 'warn',
    },
  },
];
```

### Disabling rules

Passing `false` for a rule sets it to `off`. Passing `sortImports: false` removes the import-order
entry from the config altogether, which is what you want when another sorter owns import order.

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    absoluteRelative: false,
    noCrossSegmentReexport: false,
    sortImports: false,
  }),
];
```

The bundled sorting conflicts with other import sorters. If your config already runs `import-x/order`,
`import/order`, `simple-import-sort` or `perfectionist/sort-imports`, turn one of the two sides off,
otherwise the two will fight over the same lines.

### Ignoring imports and files

Both options take [picomatch](https://github.com/micromatch/picomatch) globs, but they are matched
against different strings:

- `ignoreImports` is matched against the import specifier exactly as it is written in the code, so
  the pattern looks like the import.
- `ignoreFiles` is matched against the absolute path of the file being linted, which starts at the
  root of the filesystem and not at your project. That is why these patterns have to start with
  `**/`.

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layersSlices: {
      ignoreImports: ['@/entities/legacy', '**/vendor/**'],
      ignoreFiles: ['**/src/legacy/**/*'],
    },
    publicApi: {
      ignoreFiles: ['**/*.stories.tsx'],
    },
  }),
];
```

### Custom layers

`layers` is the whole hierarchy, written from the lowest layer to the highest. A plain string means
a layer that has slices; an object lets you say otherwise. The array replaces the defaults, so list
every layer your project uses, including the ones you keep from FSD.

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layers: [
      { name: 'shared', hasSlices: false },
      'entities',
      'domain',
      'features',
      'widgets',
      'pages',
      { name: 'app', hasSlices: false },
    ],
  }),
];
```

What each rule does with the list:

- `layers-slices` derives the hierarchy from the order, and names the full order in its message.
  A layer with `hasSlices: false` never triggers the slice-to-slice check.
- `absolute-relative` uses `hasSlices` to decide whether a path stays inside one unit: in a layer
  without slices the whole layer counts as one unit, so imports inside it must be relative.
- `public-api` uses the names to find the layer and the slice in a path, and to spot an `index`
  file placed directly on a layer.
- `no-cross-segment-reexport` only looks at layers that have slices.
- The import sorting preset builds one path group per layer, in reverse order, so the topmost layer
  is sorted first.
- The `@x` cross-import notation is matched on the literal name `entities` and ignores this list
  entirely. Rename that layer and every cross-import inside it turns into an ordinary violation.

A name the list does not contain is not a layer at all. A path with no known layer in it is left
alone by all four FSD rules, which is how imports of npm packages stay silent; the import sorting
preset still sees them and files them under `external`.

### Custom segments

An array adds names to the defaults (`ui`, `model`, `lib`, `api`, `config`, `assets`), while
`{ replace: [...] }` throws the defaults away and uses only what you list.

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    segments: ['services', 'hooks', 'i18n'],
    publicApi: { level: 'segments' },
  }),
];
```

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    segments: { replace: ['ui', 'model', 'services'] },
  }),
];
```

The segment list is used by `public-api`, where at `level: 'segments'` a folder standing in segment
position that is not on the list is reported as `unknown-segment`, and by the path parsing that
`layers-slices` relies on to tell a slice from a segment. Teaching the plugin about a custom
segment therefore removes false positives from `public-api` and from `layers-slices`.

Known limitations. Two rules never read the `segments` option and match segment names against a
built-in list instead, so in a project with custom segment names their idea of where a segment
starts differs from the other rules:

- `absolute-relative` resolves the slice of a path with the built-in list, so an absolute import
  that stays inside a single slice is not reported when that slice uses a custom segment name. See
  [issue #37](https://github.com/conarti/eslint-plugin-feature-sliced/issues/37).
- `no-cross-segment-reexport` matches sibling segment names against the same built-in list. See
  [issue #35](https://github.com/conarti/eslint-plugin-feature-sliced/issues/35).

### Import sorting presets

All four presets share the same alphabetical sort (ascending, case insensitive) and the same layer
path groups. They differ only in blank lines and in whether type imports get a group of their own:

| Preset | Blank line between groups | Separate group for type imports |
| - | - | - |
| `'recommended'` | no | no |
| `'with-newlines'` | yes | no |
| `'with-type-group'` | no | yes |
| `'with-newlines-and-type-group'` | yes | yes |

The group order is `builtin`, `external`, `internal`, then `parent`, `sibling` and `index`. The
`internal` group holds the FSD layers, sorted from the top of the hierarchy down: `app`,
`processes`, `pages`, `widgets`, `features`, `entities`, `shared`. The two type-group presets
insert a `type` group between `internal` and `parent`.

A sorted file under the default `'recommended'` preset. It is not part of the fixture, but it
has the shape of an `src/app/providers/router.ts`: it sits on the topmost layer, so it may reach
every layer below it, and the two relative imports stay inside `app`, which has no slices:

```ts
import path from 'node:path';
import axios from 'axios';
import { HomePage } from 'src/pages/home';
import { Header } from 'src/widgets/header';
import { loginUser } from 'src/features/auth';
import { createUser } from 'src/entities/user';
import { formatDate } from 'src/shared/lib/format-date';
import { routes } from '../routes';
import { withAuth } from './with-auth';
```

Pick a preset with `sortImports`, change its level as shown under [Severity](#severity), or drop it
with `sortImports: false`.

### Advanced: using the plugin object directly

The factory is a convenience. If you would rather write the three pieces yourself, import the
plugin object and the rule names and wire them up by hand.

The `settings['@conarti/feature-sliced']` key is optional: leave it out and the rules fall back to
the default layers and segments. Supply `layers` there and it has to be in its normalized form, an
object with `name` and `hasSlices` for every entry, because the rules take that array as it is and
skip the normalization the factory performs. A plain string in it is not understood, and the layer
list silently degrades.

```js
import { plugin, RULE_NAMES } from '@conarti/eslint-plugin-feature-sliced';

export default [
  {
    name: 'feature-sliced/manual',
    plugins: {
      '@conarti/feature-sliced': plugin,
    },
    settings: {
      '@conarti/feature-sliced': {
        layers: [
          { name: 'shared', hasSlices: false },
          { name: 'entities', hasSlices: true },
          { name: 'features', hasSlices: true },
          { name: 'widgets', hasSlices: true },
          { name: 'pages', hasSlices: true },
          { name: 'processes', hasSlices: true },
          { name: 'app', hasSlices: false },
        ],
        segments: ['services'],
      },
    },
    rules: {
      [RULE_NAMES.LAYERS_SLICES]: ['error', { allowTypeImports: true }],
      [RULE_NAMES.ABSOLUTE_RELATIVE]: ['error', {}],
      [RULE_NAMES.PUBLIC_API]: ['error', { level: 'segments' }],
      [RULE_NAMES.NO_CROSS_SEGMENT_REEXPORT]: ['warn', {}],
    },
  },
];
```

The full list of exports:

| Export | Kind | What it is |
| - | - | - |
| `default` | function | The factory, the same value as `createPlugin`. |
| `createPlugin` | function | Builds the flat-config object from the options above. |
| `plugin` | object | The raw ESLint plugin: `meta` plus `rules`. |
| `PLUGIN_NAME` | string | `'@conarti/feature-sliced'`, the key used in `plugins`, `settings` and rule ids. |
| `RULE_NAMES` | object | The five fully qualified rule ids. |
| `layers` | array | Deprecated. The FSD layer names, kept for compatibility. |
| `segments` | array | Deprecated. The FSD segment names, kept for compatibility. |
| `Severity`, `Layer`, `Segment`, `ImportOrderConfigName`, `TypedFlatConfigItem` | types | TypeScript types for the options and the returned config. |

`layers` and `segments` are constants only. The rules take their lists from the settings the
factory writes, so reading or reassigning these exports changes nothing.

## Cross-imports with `@x`

FSD allows one entity to depend on another through an explicit, one-directional cross-import, the
[public API for cross-imports](https://fsd.how/docs/reference/public-api/#public-api-for-cross-imports).
The importing slice is named in the path, so the dependency is visible from the import alone.

The plugin recognizes the notation only on paths that contain a layer literally named `entities`,
whatever the `layers` option says, written as `entities/<source>/@x/<target>`, and accepts it only
when `<target>` is the slice of the file doing the importing. `absolute-relative` treats such a
path as absolute and leaves it alone, and `public-api` at `level: 'segments'` exempts it from the
unknown-segment check.

Valid, `src/entities/user/model/valid-cross-import.ts`. The importing file lives in the `user`
slice and the path ends in `@x/user`:

```ts
import { sessionId } from 'src/entities/session/@x/user';
```

Invalid, `src/entities/product/model/invalid-cross-import.ts`. The same path read from the
`product` slice:

```ts
import { userRef } from 'src/entities/session/@x/user';
```

> Cross-import "session/@x/user" is only allowed from slice "user"

Nothing may follow the target slice. A path such as `src/entities/session/@x/user/types` is not a
cross-import at all, and falls back to the ordinary slice-to-slice and public API checks.

## Rules

🔧 fixable with ESLint's fix mode, see the
[ESLint command line interface](https://eslint.org/docs/latest/use/command-line-interface)

💡 offers an editor suggestion, applied one at a time and never in bulk

| Rule | Description | 🔧 | 💡 |
| - | - | - | - |
| [`@conarti/feature-sliced/layers-slices`](src/rules/layers-slices/README.md) | Checks layer imports | | |
| [`@conarti/feature-sliced/absolute-relative`](src/rules/absolute-relative/README.md) | Checks for absolute and relative paths | | |
| [`@conarti/feature-sliced/public-api`](src/rules/public-api/README.md) | Check for module imports from public api | | 💡 |
| [`@conarti/feature-sliced/no-cross-segment-reexport`](src/rules/no-cross-segment-reexport/README.md) | Checks for cross-segment re-exports within the same slice | | 💡 |
| [`@conarti/feature-sliced/import-order`](https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md) | Sorts imports, the `order` rule of `eslint-plugin-import-x` preconfigured for FSD layers | 🔧 | |

Known limitation: the `public-api` check for an `index` file placed directly on a layer does not
fire when the project sits under a directory whose name begins with a dot. See
[issue #34](https://github.com/conarti/eslint-plugin-feature-sliced/issues/34).

## Migrating from 1.x

| 1.x | 2.x |
| - | - |
| `.eslintrc`, ESLint 8 | `eslint.config.js`, ESLint 9 flat config only |
| `"extends": ["plugin:@conarti/feature-sliced/recommended"]` | `featureSliced()` |
| `"extends": ["plugin:@conarti/feature-sliced/rules"]` | `featureSliced({ sortImports: false })` |
| `"plugins": ["@conarti/feature-sliced"]` plus hand written `rules` | spread `featureSliced()`, or use `plugin` and `RULE_NAMES` as shown under Advanced |
| `eslint-plugin-import` installed alongside the plugin | nothing extra to install, `eslint-plugin-import-x` ships as a dependency |
| `@conarti/eslint-plugin-feature-sliced/import-order` subpath with its four configs | the `sortImports` option with the same four preset names |
| `import/order` rule id | `@conarti/feature-sliced/import-order` rule id |
| `ignorePatterns` rule option | `ignoreImports` |
| `ignoreInFilesPatterns` rule option | `ignoreFiles` |
| severity written out per rule | the `severity` option, plus a per-rule `severity` |
| fixed FSD layer names | the `layers` option, with `hasSlices` per layer |
| fixed FSD segment names | the `segments` option, extend or replace |
| three rules | four FSD rules plus the bundled `import-order`, and the new `no-cross-segment-reexport` is on by default at `error` |
| no cross-import notation | `@x` cross-imports understood by `layers-slices`, `absolute-relative` and `public-api` |

Node 18.18 or newer is required as well. The 1.x line stays on npm as
`@conarti/eslint-plugin-feature-sliced@1` for projects that cannot move yet.

## Development

```sh
npm ci
npm run test:run      # vitest, unit suites plus the fixture integration test
npm run lint          # eslint on the repo itself
npm run type-check    # tsc, no emit
npm run knip          # unused files, exports and dependencies
npm run build         # tsup, writes dist
npm run smoke         # asserts the built ESM and CJS entries expose the expected API
npm run test:mutation # stryker, incremental
```

CI runs the type check, the lint, knip, the tests, the build and the smoke test on Node 22 and
24, repeats the build and the smoke test on Node 18 and 20, and, on every pull request targeting
`master` or `main`, lints the commit messages of that pull request.

`tests/fixtures/basic-project` is the end-to-end anchor. It is a real, deliberately broken FSD tree
that carries at least one violation per message id plus a set of files that have to stay silent,
and the integration test runs ESLint over it with the plugin built from `src` and compares the whole report
with a committed snapshot. A refactor that breaks the plumbing without breaking any unit test gets
caught there, so read `tests/fixtures/basic-project/README.md` before touching it.

### Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):
`type(scope): description`, header of at most 100 characters, and a subject written in neither
sentence, start, pascal nor upper case. The allowed types are `build`, `chore`, `ci`, `docs`,
`feat`, `fix`, `perf`, `refactor`, `revert`, `style` and `test`.

Two extra rules apply to the whole message, header, body and footer alike. It has to stay ASCII, so
no typographic dashes, arrows, emoji or non latin text. And it must not carry attribution lines: no
`Co-authored-by:` trailer, no line starting with `Generated with`. Messages git writes itself, such
as a merge, a revert or a `fixup!`, skip the conventional rules as long as they pass these two. One
that breaks them is linted in full, so the report also lists conventional errors next to the real
one, and they go away once the offending line is removed.

`npm ci` and `npm install` install a `commit-msg` hook through the `prepare` script, so the check
runs before the commit is written, on every Node version this package supports. The hook reads the
file git is about to commit, where comment lines and the diff below the scissors line are not part
of the message; CI reads the stored commit, where a line starting with a hash counts too. CI lints
every commit of a pull request, because pull requests are rebased onto master and each commit lands
there as is. To check a range by hand:

```sh
npx --no -- commitlint --from origin/master --to HEAD --verbose
```

## License

ISC.

Found a bug or a false positive?
[Open an issue](https://github.com/conarti/eslint-plugin-feature-sliced/issues). Pull requests are
welcome.
