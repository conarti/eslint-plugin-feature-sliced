# @conarti/eslint-plugin-feature-sliced

ESLint plugin for [Feature-Sliced Design](https://feature-sliced.design/) methodology.

[📖 Documentation](https://conarti.github.io/eslint-plugin-feature-sliced/) | [🇷🇺 Русская версия](./README.ru.md)

## What is Feature-Sliced Design?

Feature-Sliced Design (FSD) is an architectural methodology for frontend projects. It provides rules for organizing code in a scalable and maintainable way through layers, slices, and segments.

Learn more at [feature-sliced.design](https://feature-sliced.design/).

## Features

- Works with **any framework** (React, Vue, Angular, etc.)
- Supports **any path aliases** out of the box
- **4 rules** covering all FSD import conventions
- Full **ESLint 9 Flat Config** support
- **TypeScript** friendly

## Installation

```sh
npm install -D @conarti/eslint-plugin-feature-sliced eslint
```

**Requirements:**
- Node.js >= 18.0.0
- ESLint >= 9.0.0

## Quick Start

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

## What's Included

### Layer Import Validation

```js
// ❌ Error: Cannot import from higher layer
import { LoginForm } from 'features/login'; // in entities/user

// ✅ Correct
import { User } from 'entities/user'; // in features/login
```

### Path Type Validation

```js
// ❌ Error: Should be relative within same slice
import { useLogin } from 'features/login/model'; // in features/login/ui

// ✅ Correct
import { useLogin } from '../model';
```

### Public API Enforcement

```js
// ❌ Error: Import from internal file
import { userModel } from 'entities/user/model/user';

// ✅ Correct
import { userModel } from 'entities/user';
```

### Import Sorting

```js
// Sorted by: external → layers (app→shared) → relative
import React from 'react';
import axios from 'axios';
import { Header } from 'widgets/header';
import { LoginForm } from 'features/login';
import { User } from 'entities/user';
import { Button } from 'shared/ui';
import { something } from './lib';
```

## Rules

| Rule | Description | Fix |
|------|-------------|-----|
| [layers-slices](src/rules/layers-slices/README.md) | Validates imports between layers | |
| [absolute-relative](src/rules/absolute-relative/README.md) | Validates path types | |
| [public-api](src/rules/public-api/README.md) | Enforces public API imports | 💡 |
| [import-order](src/rules/import-order/README.md) | Sorts imports by FSD layers | 🔧 |

## Configuration

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layersSlices: {
      allowTypeImports: true,
      ignorePatterns: ['**/legacy/**/*'],
      ignoreInFilesPatterns: ['**/*.test.ts'],
    },

    absoluteRelative: {
      ignorePatterns: ['*.css'],
    },

    publicApi: {
      level: 'segments', // or 'slices' (default)
    },

    sortImports: 'with-newlines', // or 'recommended', 'with-type-group', false
  }),
];
```

### Disabling Rules

```js
featureSliced({
  absoluteRelative: false,
  sortImports: false,
});
```

## Alias Support

The plugin recognizes any alias format:

```js
import { Button } from '@/shared/ui';
import { Button } from '~/shared/ui';
import { Button } from '$shared/ui';
import { Button } from 'shared/ui';
```

## Migration from v1

See the [Migration Guide](https://conarti.github.io/eslint-plugin-feature-sliced/en/migration-v2) for upgrading from v1.x.

## Contributing

Contributions are welcome! Please open an issue or pull request.

## License

ISC
