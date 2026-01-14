# Сортировка импортов по слоям FSD (`@conarti/feature-sliced/import-order`)

Это правило автоматически исправляется с помощью `--fix`.

Сортирует импорты согласно иерархии слоёв Feature-Sliced Design с использованием [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x).

## Описание правила

Это правило сортирует импорты по группам:

1. Встроенные модули (`node:fs`, `path`)
2. Внешние зависимости (`react`, `lodash`)
3. Внутренние — слои FSD в порядке: `app` → `processes` → `pages` → `widgets` → `features` → `entities` → `shared`
4. Родительские импорты (`../`)
5. Сиблинг-импорты (`./`)
6. Index-импорты

Внутри каждой группы импорты сортируются по алфавиту.

### До

```js
import { Button } from 'shared/ui';
import axios from 'axios';
import { User } from 'entities/user';
import { LoginForm } from 'features/login';
import { Header } from 'widgets/header';
import { something } from './lib';
import React from 'react';
```

### После

```js
import React from 'react';
import axios from 'axios';
import { Header } from 'widgets/header';
import { LoginForm } from 'features/login';
import { User } from 'entities/user';
import { Button } from 'shared/ui';
import { something } from './lib';
```

## Конфигурации

| Название | Описание |
|----------|----------|
| `recommended` | Сортировка по умолчанию, без пустых строк между группами |
| `with-newlines` | Пустая строка между каждой группой |
| `with-type-group` | Отдельная группа для type-импортов |
| `with-newlines-and-type-group` | Пустые строки + отдельная группа для типов |

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

## Отключение

Чтобы отключить сортировку импортов:

```js
featureSliced({
  sortImports: false,
});
```

## Конфликт с другими плагинами

Это правило может конфликтовать с другими плагинами сортировки импортов, такими как `eslint-plugin-import` или `eslint-plugin-simple-import-sort`. Если вы используете другое решение для сортировки, отключите это правило.

## Дополнительная информация

- [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)
- [import/order rule](https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md)
