# Check for module imports from public api (`@conarti/feature-sliced/public-api`)

💡 This rule is manually fixable by editor suggestions.

This rule enforces that imports from another slice only go through that slice's public API (its `index` file), instead of reaching into the slice's internal segments or files directly.

## Rule Details

Examples of **incorrect** code for this rule:

```js
// filename: src/features/search-articles/...

import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/file.ts';
```

Examples of **correct** code for this rule:

```js
// filename: src/features/search-articles/...

import { addCommentFormActions, addCommentFormReducer } from 'entities/Article';
```

A suggestion is offered to remove the internal part of the path and import from the slice's public API instead.

The rule also flags an `index` file placed at the root of a layer (e.g. `src/entities/index.ts`), whatever its contents, since a layer-level public API is not allowed in FSD.

That check now covers two cases it used to miss, both from
[issue #34](https://github.com/conarti/eslint-plugin-feature-sliced/issues/34). It reads the
configured `layers` list rather than the built-in layer names, so an `index` file on a custom
layer is flagged:

```js
// filename: src/domain/index.ts, with layers: [..., 'entities', 'domain', 'features', ...]

export { thing } from './thing';
```

> The layer public API is not allowed. It harms both architecturally and practically (code splitting)

And it fires under a directory whose name begins with a dot, such as a checkout inside
`.cache/` or `.worktrees/`, which previously turned the check off for the whole project.

### Options

`level: 'slices'`

Adjusts the validation depth. `'slices'` (the default) requires an import of another slice to stop at that slice. `'segments'` additionally validates at the slice's segment level, and reports an unknown/unconfigured segment name found in an import path.

At either level the rule reads the filesystem to decide where the slice ends: the folder that holds the slice's `index` file is the slice, and a folder inside it is part of that slice rather than a slice of its own. Where no `index` file can be found, the slice is derived from the shape of the path as before. The answer is cached per directory for the lifetime of the process, so an `index` file added or removed while an editor is running is not noticed until the ESLint server restarts.

```json
{
  "@conarti/feature-sliced/public-api": ["error", {
    "level": "segments"
  }]
}
```

`ignoreImports`

Array of patterns to ignore validation for certain import paths (matched against the import path as written in code).

```json
{
  "@conarti/feature-sliced/public-api": ["error", {
    "ignoreImports": ["**/foo", "@/entities/bar"]
  }]
}
```

`ignoreFiles`

Array of patterns to disable the rule for certain files or folders (matched against the file being linted).

```json
{
  "@conarti/feature-sliced/public-api": ["error", {
    "ignoreFiles": ["**/index.*"]
  }]
}
```

Please note that the plugin reads the entire file path from the root of your system, not the project.
That's why patterns for `ignoreFiles` should start with `**`.

## When Not To Use It

Disable this rule if you are just migrating to FSD, or set it to display warnings instead of errors.
You can also specify settings to ignore certain paths during migration.
