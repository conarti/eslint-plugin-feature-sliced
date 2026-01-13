# @conarti/eslint-plugin-feature-sliced

ESLint плагин для методологии [Feature-Sliced Design](https://feature-sliced.design/).

[📖 Документация](https://conarti.github.io/eslint-plugin-feature-sliced/ru/) | [🇬🇧 English version](./README.md)

## Что такое Feature-Sliced Design?

Feature-Sliced Design (FSD) — архитектурная методология для фронтенд-проектов. Она предоставляет правила организации кода через слои, слайсы и сегменты для масштабируемости и поддерживаемости.

Подробнее на [feature-sliced.design](https://feature-sliced.design/).

## Возможности

- Работает с **любым фреймворком** (React, Vue, Angular и др.)
- Поддерживает **любые алиасы путей** из коробки
- **4 правила**, покрывающих все соглашения FSD об импортах
- Полная поддержка **ESLint 9 Flat Config**
- Дружелюбен к **TypeScript**

## Установка

```sh
npm install -D @conarti/eslint-plugin-feature-sliced eslint
```

**Требования:**
- Node.js >= 18.0.0
- ESLint >= 9.0.0

## Быстрый старт

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

## Что включено

### Валидация импортов между слоями

```js
// ❌ Ошибка: Нельзя импортировать из верхнего слоя
import { LoginForm } from 'features/login'; // в entities/user

// ✅ Правильно
import { User } from 'entities/user'; // в features/login
```

### Валидация типов путей

```js
// ❌ Ошибка: Должен быть относительный путь внутри слайса
import { useLogin } from 'features/login/model'; // в features/login/ui

// ✅ Правильно
import { useLogin } from '../model';
```

### Принуждение к Public API

```js
// ❌ Ошибка: Импорт из внутреннего файла
import { userModel } from 'entities/user/model/user';

// ✅ Правильно
import { userModel } from 'entities/user';
```

### Сортировка импортов

```js
// Сортировка: external → слои (app→shared) → relative
import React from 'react';
import axios from 'axios';
import { Header } from 'widgets/header';
import { LoginForm } from 'features/login';
import { User } from 'entities/user';
import { Button } from 'shared/ui';
import { something } from './lib';
```

## Правила

| Правило | Описание | Фикс |
|---------|----------|------|
| [layers-slices](src/rules/layers-slices/README.md) | Проверяет импорты между слоями | |
| [absolute-relative](src/rules/absolute-relative/README.md) | Проверяет типы путей | |
| [public-api](src/rules/public-api/README.md) | Требует импорты из public API | 💡 |
| [import-order](src/rules/import-order/README.md) | Сортирует импорты по слоям FSD | 🔧 |

## Конфигурация

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
      level: 'segments', // или 'slices' (по умолчанию)
    },

    sortImports: 'with-newlines', // или 'recommended', 'with-type-group', false
  }),
];
```

### Отключение правил

```js
featureSliced({
  absoluteRelative: false,
  sortImports: false,
});
```

## Поддержка алиасов

Плагин распознаёт любой формат алиасов:

```js
import { Button } from '@/shared/ui';
import { Button } from '~/shared/ui';
import { Button } from '$shared/ui';
import { Button } from 'shared/ui';
```

## Миграция с v1

Смотрите [Руководство по миграции](https://conarti.github.io/eslint-plugin-feature-sliced/ru/migration-v2) для обновления с v1.x.

## Участие в разработке

Приветствуются pull request'ы и issue!

## Лицензия

ISC
