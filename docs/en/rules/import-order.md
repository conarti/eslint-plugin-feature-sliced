# import-order

Sorts imports according to Feature-Sliced Design layer hierarchy.

**Rule name:** `@conarti/feature-sliced/import-order`

🔧 This rule is automatically fixable with `--fix`.

## Rule Details

This rule uses [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x) under the hood to sort imports by groups:

1. Built-in modules (`node:fs`, `path`)
2. External dependencies (`react`, `lodash`)
3. Internal - FSD layers in order:
   - `app`
   - `processes`
   - `pages`
   - `widgets`
   - `features`
   - `entities`
   - `shared`
4. Parent imports (`../`)
5. Sibling imports (`./`)
6. Index imports

Within each group, imports are sorted alphabetically.

## Examples

### Before

```js
import { Button } from 'shared/ui';
import axios from 'axios';
import { User } from 'entities/user';
import { LoginForm } from 'features/login';
import { Header } from 'widgets/header';
import { something } from './lib';
import React from 'react';
import { config } from '../config';
```

### After (recommended)

```js
import React from 'react';
import axios from 'axios';
import { Header } from 'widgets/header';
import { LoginForm } from 'features/login';
import { User } from 'entities/user';
import { Button } from 'shared/ui';
import { config } from '../config';
import { something } from './lib';
```

### After (with-newlines)

```js
import React from 'react';
import axios from 'axios';

import { Header } from 'widgets/header';
import { LoginForm } from 'features/login';
import { User } from 'entities/user';
import { Button } from 'shared/ui';

import { config } from '../config';

import { something } from './lib';
```

## Configurations

| Name | Description |
|------|-------------|
| `recommended` | Default sorting, no newlines between groups |
| `with-newlines` | Empty line between each group |
| `with-type-group` | Separate group for type imports |
| `with-newlines-and-type-group` | Newlines + separate type group |

### recommended (default)

```js
featureSliced({
  sortImports: 'recommended',
});
```

All imports in one block, sorted by groups.

### with-newlines

```js
featureSliced({
  sortImports: 'with-newlines',
});
```

Adds empty lines between import groups for better readability.

### with-type-group

```js
featureSliced({
  sortImports: 'with-type-group',
});
```

Type imports are placed in a separate group:

```ts
import React from 'react';
import { User } from 'entities/user';
import type { UserProps } from 'entities/user';
import type { ButtonProps } from 'shared/ui';
```

### with-newlines-and-type-group

```js
featureSliced({
  sortImports: 'with-newlines-and-type-group',
});
```

Combines newlines and separate type group:

```ts
import React from 'react';

import { User } from 'entities/user';

import type { UserProps } from 'entities/user';
import type { ButtonProps } from 'shared/ui';

import { something } from './lib';
```

## Disabling

To disable import sorting entirely:

```js
featureSliced({
  sortImports: false,
});
```

## Conflict with Other Plugins

::: warning Important
This rule may conflict with other import sorting plugins like:
- `eslint-plugin-import`
- `eslint-plugin-simple-import-sort`
- `@trivago/prettier-plugin-sort-imports`

If you use another sorting solution, disable this rule by setting `sortImports: false`.
:::

## Technical Details

The rule uses `eslint-plugin-import-x` (a fork of `eslint-plugin-import`) with pre-configured settings for FSD. The plugin is included as a dependency, so you don't need to install it separately.

The sorting is based on path patterns that match FSD layers:

```js
pathGroups: [
  { pattern: '**/?(*)app{,/**}', group: 'internal', position: 'after' },
  { pattern: '**/?(*)processes{,/**}', group: 'internal', position: 'after' },
  { pattern: '**/?(*)pages{,/**}', group: 'internal', position: 'after' },
  // ... and so on for all layers
]
```

## Configuration Example

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    sortImports: 'with-newlines',
  }),
];
```

## Further Reading

- [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)
- [import/order rule](https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md)
