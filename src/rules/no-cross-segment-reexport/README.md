# Checks for cross-segment re-exports within the same slice (`@conarti/feature-sliced/no-cross-segment-reexport`)

💡 This rule is manually fixable by editor suggestions.

This rule forbids one segment of a slice (e.g. `model`) from re-exporting from a sibling segment of the same slice (e.g. `api`). In FSD, segments should not re-export each other directly; consumers should go through the slice's public API instead.

## Rule Details

Examples of **incorrect** code for this rule:

```js
// filename: src/entities/cluster/model/index.ts

export { foo } from '../api';
export * from '../i18n';
```

Examples of **correct** code for this rule:

```js
// filename: src/entities/cluster/model/index.ts

/* re-exporting from within the same segment is fine */
export { foo } from './store';
```

```js
// filename: src/entities/cluster/index.ts (slice public API)

/* the slice's own public API is the place to re-export segments */
export { foo } from './model';
```

Only re-export statements (`export { x } from '...'`, `export type { x } from '...'`, `export * from '...'`) are checked; regular imports and non-re-export exports are not affected. External packages, imports from other slices, and imports from layers without slices (like `shared` and `app`) are ignored as well.

A suggestion is offered to replace the sibling-segment path with a relative path to the slice's public API (e.g. `../api` → `..`).

### Options

`ignoreImports`

Array of patterns to ignore validation for certain import paths (matched against the import path as written in code).

```json
{
  "@conarti/feature-sliced/no-cross-segment-reexport": ["error", {
    "ignoreImports": ["../api"]
  }]
}
```

`ignoreFiles`

Array of patterns to disable the rule for certain files or folders (matched against the file being linted).

```json
{
  "@conarti/feature-sliced/no-cross-segment-reexport": ["error", {
    "ignoreFiles": ["**/model/index.ts"]
  }]
}
```

Please note that the plugin reads the entire file path from the root of your system, not the project.
That's why patterns for `ignoreFiles` should start with `**`.

## When Not To Use It

Disable this rule if you are just migrating to FSD, or set it to display warnings instead of errors.
You can also specify settings to ignore certain paths during migration.
