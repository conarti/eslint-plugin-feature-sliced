# public-api

Enforces that absolute imports come from the public API (index files) only, not from internal module files.

**Rule name:** `@conarti/feature-sliced/public-api`

💡 This rule provides suggestions for fixing violations.

## Rule Details

In Feature-Sliced Design, each slice should expose a public API through its `index` file. This rule ensures that:

1. Absolute imports point to the public API, not internal files
2. Layer-level public API is not used (e.g., `import from 'shared'`)

This maintains proper encapsulation and makes refactoring internal structure safer.

## Examples

### ❌ Incorrect

```js
// file: src/features/search/ui.tsx

// Importing from internal file - should use public API
import { userModel } from 'entities/user/model/user';
// Error: Absolute imports are only allowed from public api ("entities/user")

// Importing from layer public API - not allowed
import { something } from 'shared';
// Error: The layer public API is not allowed
```

```js
// With level: 'segments'
// file: src/features/search/ui.tsx

import { Button } from 'shared/ui/button/Button';
// Error: Absolute imports are only allowed from public api ("shared/ui")
```

### ✅ Correct

```js
// file: src/features/search/ui.tsx

// Import from slice public API
import { userModel, User } from 'entities/user';
import { Button, Input } from 'shared/ui';
```

```js
// With level: 'segments'
// file: src/features/search/ui.tsx

// Import from segment public API
import { Button } from 'shared/ui';
import { userApi } from 'entities/user/api';
```

## Options

```ts
interface Options {
  level?: 'slices' | 'segments';
  ignorePatterns?: string[];
  ignoreInFilesPatterns?: string[];
}
```

### level

Type: `'slices' | 'segments'`
Default: `'slices'`

Defines the depth of public API validation:

#### `'slices'` (default)

Public API at slice level. Imports must be from `layer/slice`.

```js
// Valid imports with level: 'slices'
import { User } from 'entities/user';
import { Button } from 'shared/ui';
```

#### `'segments'`

Public API at segment level. Imports must be from `layer/slice/segment`.

```js
// Valid imports with level: 'segments'
import { User } from 'entities/user/model';
import { Button } from 'shared/ui';
import { userApi } from 'entities/user/api';
```

::: tip When to use segments
Use `level: 'segments'` for larger projects where you want more granular control over what's exposed from each slice.
:::

### ignorePatterns

Type: `string[]`
Default: `[]`

Glob patterns for import paths to ignore.

```js
featureSliced({
  publicApi: {
    ignorePatterns: [
      '**/types/**/*',
      '*.d.ts',
    ],
  },
});
```

### ignoreInFilesPatterns

Type: `string[]`
Default: `[]`

Glob patterns for files where the rule is disabled.

```js
featureSliced({
  publicApi: {
    ignoreInFilesPatterns: [
      '**/tests/**/*',
      '**/*.test.ts',
    ],
  },
});
```

## Configuration Example

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    publicApi: {
      level: 'segments',
      ignorePatterns: ['**/types/**/*'],
      ignoreInFilesPatterns: ['**/*.test.ts'],
    },
  }),
];
```

## Suggestions

When this rule finds a violation, it provides a suggestion to fix the import path:

```js
// Before
import { User } from 'entities/user/model/user';

// After applying suggestion
import { User } from 'entities/user';
```

## When Not To Use

- In test files that need to import internal implementations
- During migration when public APIs aren't fully set up
- For type definition files that may import from internal paths

## Further Reading

- [FSD Public API](https://feature-sliced.design/docs/reference/public-api)
