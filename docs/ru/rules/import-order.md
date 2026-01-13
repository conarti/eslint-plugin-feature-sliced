# import-order

Сортирует импорты согласно иерархии слоёв Feature-Sliced Design.

**Имя правила:** `@conarti/feature-sliced/import-order`

🔧 Это правило автоматически исправляется с `--fix`.

## Описание правила

Это правило использует [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x) для сортировки импортов по группам:

1. Встроенные модули (`node:fs`, `path`)
2. Внешние зависимости (`react`, `lodash`)
3. Внутренние — слои FSD в порядке:
   - `app`
   - `processes`
   - `pages`
   - `widgets`
   - `features`
   - `entities`
   - `shared`
4. Родительские импорты (`../`)
5. Соседние импорты (`./`)
6. Index импорты

Внутри каждой группы импорты сортируются по алфавиту.

## Примеры

### До

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

### После (recommended)

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

### После (with-newlines)

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

## Конфигурации

| Название | Описание |
|----------|----------|
| `recommended` | Сортировка по умолчанию, без переносов между группами |
| `with-newlines` | Пустая строка между каждой группой |
| `with-type-group` | Отдельная группа для type импортов |
| `with-newlines-and-type-group` | Переносы + отдельная группа типов |

### recommended (по умолчанию)

```js
featureSliced({
  sortImports: 'recommended',
});
```

Все импорты в одном блоке, отсортированные по группам.

### with-newlines

```js
featureSliced({
  sortImports: 'with-newlines',
});
```

Добавляет пустые строки между группами импортов для лучшей читаемости.

### with-type-group

```js
featureSliced({
  sortImports: 'with-type-group',
});
```

Type импорты помещаются в отдельную группу:

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

Комбинирует переносы и отдельную группу типов:

```ts
import React from 'react';

import { User } from 'entities/user';

import type { UserProps } from 'entities/user';
import type { ButtonProps } from 'shared/ui';

import { something } from './lib';
```

## Отключение

Чтобы полностью отключить сортировку импортов:

```js
featureSliced({
  sortImports: false,
});
```

## Конфликт с другими плагинами

::: warning Важно
Это правило может конфликтовать с другими плагинами сортировки импортов:
- `eslint-plugin-import`
- `eslint-plugin-simple-import-sort`
- `@trivago/prettier-plugin-sort-imports`

Если вы используете другое решение для сортировки, отключите это правило через `sortImports: false`.
:::

## Технические детали

Правило использует `eslint-plugin-import-x` (форк `eslint-plugin-import`) с предварительно настроенными параметрами для FSD. Плагин включён как зависимость, поэтому устанавливать его отдельно не нужно.

Сортировка основана на паттернах путей, соответствующих слоям FSD:

```js
pathGroups: [
  { pattern: '**/?(*)app{,/**}', group: 'internal', position: 'after' },
  { pattern: '**/?(*)processes{,/**}', group: 'internal', position: 'after' },
  { pattern: '**/?(*)pages{,/**}', group: 'internal', position: 'after' },
  // ... и так далее для всех слоёв
]
```

## Пример конфигурации

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    sortImports: 'with-newlines',
  }),
];
```

## Дополнительные материалы

- [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)
- [import/order rule](https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md)
