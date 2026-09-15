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

### Options

`level: 'slices'`

Adjusts the validation depth. `'slices'` (the default) only checks the shape of the import path, requiring it to stop at the slice; the filesystem is never read. `'segments'` additionally validates at the slice's segment level, and reports an unknown/unconfigured segment name found in an import path.

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
