# Конфигурация

## Базовая конфигурация

Для простого использования с настройками по умолчанию:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

## Расширенная конфигурация

Вы можете настроить каждое правило индивидуально:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layersSlices: {
      allowTypeImports: true,
      ignoreImports: ['**/src/legacy/**/*'],
      ignoreFiles: ['**/tests/**/*'],
    },

    absoluteRelative: {
      ignoreImports: ['**/mocks/**/*'],
      ignoreFiles: [],
    },

    publicApi: {
      level: 'segments',
      ignoreImports: [],
      ignoreFiles: [],
    },

    sortImports: 'with-newlines',
  }),
];
```

## Отключение правил

Чтобы отключить конкретное правило, установите его в `false`:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    absoluteRelative: false,
    sortImports: false,
  }),
];
```

## Кастомные слои

Вы можете определить кастомные слои для соответствия структуре вашего проекта. Это полезно, когда:
- Вы используете нестандартные FSD слои
- У вас есть дополнительные кастомные слои
- Нужно изменить, какие слои могут содержать слайсы

### Конфигурация

Опция `layers` принимает массив конфигураций слоёв:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layers: [
      { name: 'shared', hasSlices: false },
      'entities',
      'features',
      'widgets',
      'pages',
      { name: 'app', hasSlices: false },
    ],
  }),
];
```

### Типы конфигурации слоёв

Каждый слой может быть настроен как:

- **Строка** — имя слоя с `hasSlices: true` (по умолчанию)
- **Объект** — слой с явной настройкой `hasSlices`

```ts
type LayerConfigItem =
  | string
  | { name: string; hasSlices?: boolean };
```

### Свойство `hasSlices`

Свойство `hasSlices` определяет, может ли слой содержать слайсы:

- `true` (по умолчанию) — слой может содержать слайсы (например, `entities`, `features`)
- `false` — слой не может содержать слайсы (например, `shared`, `app`)

Это влияет на поведение правил:
- **layers-slices**: Слои без слайсов не проверяют изоляцию слайсов
- **absolute-relative**: Импорты внутри слоёв без слайсов должны быть относительными
- **import-order**: Группы сортировки генерируются на основе конфигурации слоёв

### Примеры

**Стандартный FSD без слоя processes:**

```js
featureSliced({
  layers: [
    { name: 'shared', hasSlices: false },
    'entities',
    'features',
    'widgets',
    'pages',
    { name: 'app', hasSlices: false },
  ],
});
```

**Кастомные слои:**

```js
featureSliced({
  layers: [
    { name: 'core', hasSlices: false },
    'domain',
    'features',
    'pages',
    { name: 'app', hasSlices: false },
  ],
});
```

**Все слои со слайсами:**

```js
featureSliced({
  layers: ['shared', 'entities', 'features', 'widgets', 'pages', 'app'],
});
```

## Справочник опций

### layersSlices

| Опция | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `allowTypeImports` | `boolean` | `true` | Разрешить type-only импорты из любого слоя |
| `ignoreImports` | `string[]` | `[]` | Glob-паттерны путей импорта для игнорирования |
| `ignoreFiles` | `string[]` | `[]` | Glob-паттерны файлов, где правило отключено |

### absoluteRelative

| Опция | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `ignoreImports` | `string[]` | `[]` | Glob-паттерны путей импорта для игнорирования |
| `ignoreFiles` | `string[]` | `[]` | Glob-паттерны файлов, где правило отключено |

### publicApi

| Опция | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `level` | `'slices'` \| `'segments'` | `'slices'` | Глубина валидации |
| `ignoreImports` | `string[]` | `[]` | Glob-паттерны путей импорта для игнорирования |
| `ignoreFiles` | `string[]` | `[]` | Glob-паттерны файлов, где правило отключено |

### sortImports

| Значение | Описание |
|----------|----------|
| `'recommended'` | Сортировка по умолчанию без переносов между группами |
| `'with-newlines'` | Пустые строки между группами импортов |
| `'with-type-group'` | Отдельная группа для type импортов |
| `'with-newlines-and-type-group'` | Переносы + отдельная группа типов |
| `false` | Отключить сортировку импортов |

## Сопоставление паттернов

Все опции `ignoreImports` и `ignoreFiles` используют glob-паттерны на базе [picomatch](https://github.com/micromatch/picomatch).

::: warning Обратите внимание
Плагин читает полный путь файла от корня системы. Всегда начинайте паттерны с `**` для корректного сопоставления.
:::

```js
featureSliced({
  layersSlices: {
    ignoreImports: [
      '**/src/legacy/**/*',
      '@/shared/deprecated/*',
    ],
    ignoreFiles: [
      '**/tests/**/*',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
  },
});
```

## Использование с другими конфигами

Плагин возвращает массив flat config, поэтому его можно комбинировать с другими конфигурациями:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  featureSliced(),
  {
    rules: {
      // ваши кастомные правила
    },
  },
];
```
