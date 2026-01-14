# Sort imports by FSD layers (`@conarti/feature-sliced/import-order`)

🔧 This rule is automatically fixable with `--fix`.

Sorts imports according to Feature-Sliced Design layer hierarchy using [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x).

## Rule Details

This rule sorts imports by groups:

1. Built-in modules (`node:fs`, `path`)
2. External dependencies (`react`, `lodash`)
3. Internal - FSD layers in order: `app` → `processes` → `pages` → `widgets` → `features` → `entities` → `shared`
4. Parent imports (`../`)
5. Sibling imports (`./`)
6. Index imports

Within each group, imports are sorted alphabetically.

### Before

```js
import { Button } from 'shared/ui';
import axios from 'axios';
import { User } from 'entities/user';
import { LoginForm } from 'features/login';
import { Header } from 'widgets/header';
import { something } from './lib';
import React from 'react';
```

### After

```js
import React from 'react';
import axios from 'axios';
import { Header } from 'widgets/header';
import { LoginForm } from 'features/login';
import { User } from 'entities/user';
import { Button } from 'shared/ui';
import { something } from './lib';
```

## Configurations

| Name | Description |
|------|-------------|
| `recommended` | Default sorting, no newlines between groups |
| `with-newlines` | Empty line between each group |
| `with-type-group` | Separate group for type imports |
| `with-newlines-and-type-group` | Newlines + separate type group |

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

## Disabling

To disable import sorting:

```js
featureSliced({
  sortImports: false,
});
```

## Conflict with Other Plugins

This rule may conflict with other import sorting plugins like `eslint-plugin-import` or `eslint-plugin-simple-import-sort`. If you use another sorting solution, disable this rule.

## Further Reading

- [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)
- [import/order rule](https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md)
