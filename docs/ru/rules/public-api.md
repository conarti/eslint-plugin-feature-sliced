# public-api

Требует, чтобы абсолютные импорты были только из публичного API (index файлов), а не из внутренних файлов модулей.

**Имя правила:** `@conarti/feature-sliced/public-api`

💡 Это правило предоставляет suggestions для исправления нарушений.

## Описание правила

В Feature-Sliced Design каждый слайс должен экспортировать публичный API через свой `index` файл. Это правило обеспечивает:

1. Абсолютные импорты указывают на публичный API, а не на внутренние файлы
2. Публичный API на уровне слоя не используется (например, `import from 'shared'`)

Это поддерживает правильную инкапсуляцию и делает рефакторинг внутренней структуры безопаснее.

## Примеры

### ❌ Неправильно

```js
// файл: src/features/search/ui.tsx

// Импорт из внутреннего файла — нужно использовать public API
import { userModel } from 'entities/user/model/user';
// Ошибка: Absolute imports are only allowed from public api ("entities/user")

// Импорт из public API слоя — запрещено
import { something } from 'shared';
// Ошибка: The layer public API is not allowed
```

```js
// С level: 'segments'
// файл: src/features/search/ui.tsx

import { Button } from 'shared/ui/button/Button';
// Ошибка: Absolute imports are only allowed from public api ("shared/ui")
```

### ✅ Правильно

```js
// файл: src/features/search/ui.tsx

// Импорт из public API слайса
import { userModel, User } from 'entities/user';
import { Button, Input } from 'shared/ui';
```

```js
// С level: 'segments'
// файл: src/features/search/ui.tsx

// Импорт из public API сегмента
import { Button } from 'shared/ui';
import { userApi } from 'entities/user/api';
```

## Опции

```ts
interface Options {
  level?: 'slices' | 'segments';
  ignorePatterns?: string[];
  ignoreInFilesPatterns?: string[];
}
```

### level

Тип: `'slices' | 'segments'`
По умолчанию: `'slices'`

Определяет глубину валидации публичного API:

#### `'slices'` (по умолчанию)

Публичный API на уровне слайса. Импорты должны быть из `layer/slice`.

```js
// Валидные импорты с level: 'slices'
import { User } from 'entities/user';
import { Button } from 'shared/ui';
```

#### `'segments'`

Публичный API на уровне сегмента. Импорты должны быть из `layer/slice/segment`.

```js
// Валидные импорты с level: 'segments'
import { User } from 'entities/user/model';
import { Button } from 'shared/ui';
import { userApi } from 'entities/user/api';
```

::: tip Когда использовать segments
Используйте `level: 'segments'` для крупных проектов, где нужен более гранулярный контроль над тем, что экспортируется из каждого слайса.
:::

### ignorePatterns

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны путей импорта для игнорирования.

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

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны файлов, где правило отключено.

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

## Пример конфигурации

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

При обнаружении нарушения правило предлагает исправление пути импорта:

```js
// До
import { User } from 'entities/user/model/user';

// После применения suggestion
import { User } from 'entities/user';
```

## Когда не использовать

- В тестовых файлах, которым нужен доступ к внутренней реализации
- При миграции, когда публичные API ещё не настроены
- Для файлов определения типов с импортами из внутренних путей

## Дополнительные материалы

- [FSD Public API](https://feature-sliced.design/docs/reference/public-api)
