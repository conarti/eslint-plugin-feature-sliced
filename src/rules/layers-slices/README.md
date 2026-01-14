# Check layers and slices imports (`@conarti/feature-sliced/layers-slices`)

Validates imports between layers and slices according to Feature-Sliced Design methodology.

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

### @x Cross-Import Pattern

The `@x` pattern allows controlled cross-imports between slices in the `entities` layer. This is useful when entities have legitimate dependencies on each other.

#### Syntax

```
entities/<source-slice>/@x/<target-slice>
```

The source slice exposes specific exports for the target slice through a special `@x` directory.

#### ✅ Valid @x imports

```js
// file: src/entities/session/model.ts
import { User } from 'entities/user/@x/session';
// OK: session can import from user's cross-import API

import { userApi } from '@/entities/user/@x/session';
// OK: alias paths are supported
```

#### ❌ Invalid @x imports

```js
// file: src/features/auth/model.ts
import { User } from 'entities/user/@x/auth';
// Error: @x is only for cross-imports between entities, not from other layers

// file: src/entities/session/model.ts
import { userModel } from 'entities/user/@x/session/model';
// Error: Nested paths after @x are not allowed
```

#### How to use @x

1. Create an `@x` directory in the source slice
2. Create a file named after the target slice (e.g., `session.ts`)
3. Export only what the target slice needs

```
entities/
├── user/
│   ├── @x/
│   │   └── session.ts    # Exports for session slice
│   ├── model/
│   └── index.ts
└── session/
    ├── model.ts          # Can import from entities/user/@x/session
    └── index.ts
```

### ❌ Incorrect

```js
// file: src/entities/user/model.ts
import { Article } from 'entities/article';
// Error: Cannot import from another slice in the same layer

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
  ignoreImports?: string[];
  ignoreFiles?: string[];
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

**Note:** Only works with explicit `type` keyword. Regular imports of types are still checked.

### ignoreImports

Type: `string[]`
Default: `[]`

Glob patterns for import paths to ignore.

```js
featureSliced({
  layersSlices: {
    ignoreImports: ['**/legacy/**/*', '@/shared/deprecated/*'],
  },
});
```

### ignoreFiles

Type: `string[]`
Default: `[]`

Glob patterns for files where the rule is disabled.

```js
featureSliced({
  layersSlices: {
    ignoreFiles: ['**/tests/**/*', '**/*.test.ts', '**/*.stories.tsx'],
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
      ignoreImports: ['**/mocks/**/*'],
      ignoreFiles: ['**/*.test.ts'],
    },
  }),
];
```

## When Not To Use

- During migration to FSD - consider using `ignoreImports` instead
- In test files that need cross-layer imports - use `ignoreFiles`
- In Storybook stories - use `ignoreFiles`

## Further Reading

- [FSD Layers](https://feature-sliced.design/docs/reference/units/layers)
- [FSD Slices](https://feature-sliced.design/docs/reference/units/slices)
