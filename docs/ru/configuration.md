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
      ignorePatterns: ['**/src/legacy/**/*'],
      ignoreInFilesPatterns: ['**/tests/**/*'],
    },

    absoluteRelative: {
      ignorePatterns: ['**/mocks/**/*'],
      ignoreInFilesPatterns: [],
    },

    publicApi: {
      level: 'segments',
      ignorePatterns: [],
      ignoreInFilesPatterns: [],
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

## Справочник опций

### layersSlices

| Опция | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `allowTypeImports` | `boolean` | `true` | Разрешить type-only импорты из любого слоя |
| `ignorePatterns` | `string[]` | `[]` | Glob-паттерны путей импорта для игнорирования |
| `ignoreInFilesPatterns` | `string[]` | `[]` | Glob-паттерны файлов, где правило отключено |

### absoluteRelative

| Опция | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `ignorePatterns` | `string[]` | `[]` | Glob-паттерны путей импорта для игнорирования |
| `ignoreInFilesPatterns` | `string[]` | `[]` | Glob-паттерны файлов, где правило отключено |

### publicApi

| Опция | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `level` | `'slices'` \| `'segments'` | `'slices'` | Глубина валидации |
| `ignorePatterns` | `string[]` | `[]` | Glob-паттерны путей импорта для игнорирования |
| `ignoreInFilesPatterns` | `string[]` | `[]` | Glob-паттерны файлов, где правило отключено |

### sortImports

| Значение | Описание |
|----------|----------|
| `'recommended'` | Сортировка по умолчанию без переносов между группами |
| `'with-newlines'` | Пустые строки между группами импортов |
| `'with-type-group'` | Отдельная группа для type импортов |
| `'with-newlines-and-type-group'` | Переносы + отдельная группа типов |
| `false` | Отключить сортировку импортов |

## Сопоставление паттернов

Все опции `ignorePatterns` и `ignoreInFilesPatterns` используют glob-паттерны на базе [picomatch](https://github.com/micromatch/picomatch).

::: warning Обратите внимание
Плагин читает полный путь файла от корня системы. Всегда начинайте паттерны с `**` для корректного сопоставления.
:::

```js
featureSliced({
  layersSlices: {
    ignorePatterns: [
      '**/src/legacy/**/*',
      '@/shared/deprecated/*',
    ],
    ignoreInFilesPatterns: [
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
