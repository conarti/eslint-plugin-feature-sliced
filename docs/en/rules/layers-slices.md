# layers-slices

Validates imports between layers and slices according to Feature-Sliced Design methodology.

**Rule name:** `@conarti/feature-sliced/layers-slices`

## Rule Details

This rule enforces two main FSD principles:

1. **Layer hierarchy** - lower layers cannot import from higher layers
2. **Slice isolation** - slices within the same layer cannot import from each other

### Layer Hierarchy

Layers are ordered from lowest to highest:

```
shared → entities → features → widgets → pages → processes → app
```

A layer can only import from layers below it.

### Slice Isolation

Within layers that have slices (`entities`, `features`, `widgets`, `pages`, `processes`), one slice cannot import from another slice in the same layer.

## Examples

### ❌ Incorrect

```js
// file: src/entities/user/model.ts
import { Article } from 'entities/article';
// Error: Cannot import from another slice in the same layer
```

```js
// file: src/entities/user/model.ts
import { LoginForm } from 'features/login';
// Error: Cannot import from a higher layer
```

```js
// file: src/shared/ui/button.ts
import { User } from 'entities/user';
// Error: Cannot import from a higher layer
```

### ✅ Correct

```js
// file: src/features/login/ui.tsx
import { User } from 'entities/user';
// OK: features can import from entities
```

```js
// file: src/features/login/ui.tsx
import { Button } from 'shared/ui';
// OK: features can import from shared
```

```js
// file: src/app/App.tsx
import { Router } from 'app/providers/router';
// OK: imports within app layer are allowed
```

```js
// file: src/features/login/model.ts
import type { User } from 'entities/user';
// OK: type imports are allowed (with allowTypeImports: true)
```

## Options

```ts
interface Options {
  allowTypeImports?: boolean;
  ignorePatterns?: string[];
  ignoreInFilesPatterns?: string[];
}
```

### allowTypeImports

Type: `boolean`
Default: `true`

Allows type-only imports from any layer. Recommended for TypeScript projects.

```ts
// With allowTypeImports: true (default)
import type { User } from 'entities/user'; // OK in shared layer
```

::: warning
Only works with explicit `type` keyword. Regular imports of types are still checked.
:::

```ts
// Still an error even if User is only a type
import { User } from 'entities/user';
```

### ignorePatterns

Type: `string[]`
Default: `[]`

Glob patterns for import paths to ignore.

```js
featureSliced({
  layersSlices: {
    ignorePatterns: [
      '**/legacy/**/*',
      '@/shared/deprecated/*',
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
  layersSlices: {
    ignoreInFilesPatterns: [
      '**/tests/**/*',
      '**/*.test.ts',
      '**/*.stories.tsx',
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
    layersSlices: {
      allowTypeImports: true,
      ignorePatterns: ['**/mocks/**/*'],
      ignoreInFilesPatterns: ['**/*.test.ts'],
    },
  }),
];
```

## When Not To Use

- During migration to FSD - consider using `ignorePatterns` instead
- In test files that need cross-layer imports - use `ignoreInFilesPatterns`
- In Storybook stories - use `ignoreInFilesPatterns`

## Further Reading

- [FSD Layers](https://feature-sliced.design/docs/reference/units/layers)
- [FSD Slices](https://feature-sliced.design/docs/reference/units/slices)
