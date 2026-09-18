# Checks for absolute and relative paths (`@conarti/feature-sliced/absolute-relative`)

This rule enforces that imports within the same slice (or within the same layer, for layers without slices, like `shared` and `app`) use relative paths, and that imports from another layer must be absolute.

## Rule Details

Examples of **incorrect** code for this rule:

```js
// filename: src/widgets/TheHeader/ui/TheHeader.stories.tsx

import { TheHeader } from 'src/widgets/TheHeader'; // should be relative
import { TheHeader } from 'widgets/TheHeader'; // should be relative
import { useBar } from '../../../shared/hooks'; // should be absolute
```

Examples of **correct** code for this rule:

```js
// filename: src/widgets/TheHeader/ui/TheHeader.stories.tsx

import { TheHeader } from './TheHeader';
import { useBar } from 'shared/hooks';
```

Cross-imports (`@x/`) are always treated as absolute and are not checked by this rule.

The rule reads the `segments` setting that `featureSliced()` writes, so a slice that uses a
custom segment name is recognized as one slice. Before that, segment names were matched against
a built-in list only, and an absolute import that never left such a slice went unreported. See
[issue #37](https://github.com/conarti/eslint-plugin-feature-sliced/issues/37).

```js
// filename: src/entities/cart/ui/cart.ts, with segments: ['services']

import { checkout } from 'src/entities/cart/services/checkout'; // should be relative
```

The slice boundary is also read from the filesystem: the folder that holds the slice's `index`
file is the slice, and a folder inside it is part of it rather than a slice of its own. An
absolute import between two such folders is reported as one that should be relative, whether or
not the folder names appear in the `segments` setting.

### Options

`ignoreImports`

Array of patterns to ignore validation for certain import paths (matched against the import path as written in code).

```json
{
  "@conarti/feature-sliced/absolute-relative": ["error", {
    "ignoreImports": ["**/foo", "@/entities/bar"]
  }]
}
```

`ignoreFiles`

Array of patterns to disable the rule for certain files or folders (matched against the file being linted).

```json
{
  "@conarti/feature-sliced/absolute-relative": ["error", {
    "ignoreFiles": ["**/src/shared/foo/**/*"]
  }]
}
```

Please note that the plugin reads the entire file path from the root of your system, not the project.
That's why patterns for `ignoreFiles` should start with `**`.

## When Not To Use It

Disable this rule if you don't want to enforce absolute/relative import conventions, or if you are migrating to FSD.
You can also specify settings to ignore certain paths during migration.
