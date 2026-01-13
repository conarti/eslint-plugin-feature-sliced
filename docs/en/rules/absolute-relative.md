# absolute-relative

Validates that imports use the correct path type (absolute or relative) based on FSD principles.

**Rule name:** `@conarti/feature-sliced/absolute-relative`

## Rule Details

This rule enforces path conventions in Feature-Sliced Design:

- **Within the same slice** → use relative paths (`./`, `../`)
- **Between different slices/layers** → use absolute paths

This ensures clear boundaries between modules and makes refactoring easier.

## Examples

### ❌ Incorrect

```js
// file: src/features/login/ui/LoginForm.tsx

// Using absolute path for same slice - should be relative
import { useLogin } from 'features/login/model';
// Error: There must be relative paths

// Using relative path for different layer - should be absolute
import { Button } from '../../../shared/ui';
// Error: There must be absolute paths
```

```js
// file: src/shared/ui/button/Button.tsx

// Using absolute path within shared layer - should be relative
import { Icon } from 'shared/ui/icon';
// Error: There must be relative paths
```

### ✅ Correct

```js
// file: src/features/login/ui/LoginForm.tsx

// Relative path within the same slice
import { useLogin } from '../model';
import { LoginButton } from './LoginButton';

// Absolute path for different layers
import { Button } from '@/shared/ui';
import { User } from 'entities/user';
```

```js
// file: src/shared/ui/button/Button.tsx

// Relative paths within shared layer (no slices)
import { Icon } from '../icon';
import { theme } from '../../lib/theme';
```

## Path Resolution

The rule understands various alias formats:

```js
// All these are treated as absolute paths
import { Button } from '@/shared/ui';
import { Button } from '~/shared/ui';
import { Button } from '$shared/ui';
import { Button } from 'shared/ui';
import { Button } from 'src/shared/ui';
```

## Options

```ts
interface Options {
  ignorePatterns?: string[];
  ignoreInFilesPatterns?: string[];
}
```

### ignorePatterns

Type: `string[]`
Default: `[]`

Glob patterns for import paths to ignore.

```js
featureSliced({
  absoluteRelative: {
    ignorePatterns: [
      '**/assets/**/*',
      '*.css',
      '*.scss',
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
  absoluteRelative: {
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
    absoluteRelative: {
      ignorePatterns: ['*.css'],
      ignoreInFilesPatterns: ['**/*.test.ts'],
    },
  }),
];
```

## When Not To Use

- If your project doesn't follow FSD path conventions
- For style imports that don't follow module boundaries
- In configuration files that need specific import styles

## Further Reading

- [FSD Public API](https://feature-sliced.design/docs/reference/public-api)
