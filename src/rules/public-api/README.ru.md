# Проверка импортов из public API (`@conarti/feature-sliced/public-api`)

Это правило предоставляет предложения по исправлению нарушений.

Требует, чтобы абсолютные импорты шли только из public API (index-файлов), а не из внутренних файлов модуля.

## Описание правила

В Feature-Sliced Design каждый слайс должен предоставлять public API через свой `index` файл. Это правило проверяет, что:

1. Абсолютные импорты указывают на public API, а не на внутренние файлы
2. Public API уровня слоя не используется (например, `import from 'shared'`)

Это поддерживает правильную инкапсуляцию и делает рефакторинг внутренней структуры безопаснее.

### Неправильно

```js
// файл: src/features/search/ui.tsx

// Импорт из внутреннего файла — должен использовать public API
import { userModel } from 'entities/user/model/user';
// Ошибка: Абсолютные импорты разрешены только из public api ("entities/user")

// Импорт из public API слоя — не разрешено
import { something } from 'shared';
// Ошибка: Public API уровня слоя не разрешён
```

```js
// С level: 'segments'
// файл: src/features/search/ui.tsx

import { Button } from 'shared/ui/button/Button';
// Ошибка: Абсолютные импорты разрешены только из public api ("shared/ui")
```

### Правильно

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

Определяет глубину проверки public API:

- `'slices'` — Public API на уровне слайса (`layer/slice`)
- `'segments'` — Public API на уровне сегмента (`layer/slice/segment`)

### ignorePatterns

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны для путей импортов, которые нужно игнорировать.

### ignoreInFilesPatterns

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны для файлов, в которых правило отключено.

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

## Когда не использовать

- В тестовых файлах, которым нужен импорт внутренних реализаций
- При миграции, когда public API ещё не полностью настроен
- Для файлов с определениями типов, которые могут импортировать из внутренних путей

## Дополнительная информация

- [FSD Public API](https://feature-sliced.design/docs/reference/public-api)
