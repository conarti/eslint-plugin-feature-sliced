# Миграция с v1 на v2

Это руководство описывает переход с `@conarti/eslint-plugin-feature-sliced` v1.x на v2.0.

## Обзор

Версия 2.0 — мажорный релиз, который:

- Прекращает поддержку ESLint 8.x
- Использует исключительно ESLint 9 Flat Config
- Переходит на `eslint-plugin-import-x` вместо `eslint-plugin-import`
- Улучшает поддержку TypeScript
- Добавляет новые опции конфигурации

## Требования

- **Node.js**: >= 18.0.0
- **ESLint**: >= 9.0.0

## Ломающие изменения

### 1. Требуется ESLint 9

v2.0 поддерживает только ESLint 9 с Flat Config. Если вы используете ESLint 8.x, сначала нужно обновить ESLint.

```bash
npm install eslint@^9.0.0
```

### 2. Изменился формат конфигурации

v1.x использовал устаревший формат `.eslintrc`:

```json
// .eslintrc.json (v1.x - СТАРОЕ)
{
  "plugins": ["@conarti/feature-sliced"],
  "rules": {
    "@conarti/feature-sliced/layers-slices": "error",
    "@conarti/feature-sliced/absolute-relative": "error",
    "@conarti/feature-sliced/public-api": "error"
  }
}
```

v2.0 использует ESLint 9 Flat Config:

```js
// eslint.config.js (v2.0 - НОВОЕ)
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

### 3. Функция плагина вместо extends

v2.0 экспортирует функцию, которая возвращает массив flat config:

```js
// v1.x - СТАРОЕ
export default {
  plugins: ['@conarti/feature-sliced'],
  extends: ['plugin:@conarti/feature-sliced/recommended'],
};

// v2.0 - НОВОЕ
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

### 4. import-order использует import-x

Сортировка импортов теперь использует `eslint-plugin-import-x` (форк, совместимый с ESLint 9) вместо `eslint-plugin-import`.

Если у вас есть кастомные конфигурации `import/order`, возможно, потребуется адаптировать их для `import-x/order`.

## Пошаговая миграция

### Шаг 1: Обновите зависимости

```bash
npm uninstall @conarti/eslint-plugin-feature-sliced
npm install -D @conarti/eslint-plugin-feature-sliced@^2.0.0 eslint@^9.0.0
```

### Шаг 2: Создайте eslint.config.js

Создайте новый файл `eslint.config.js`:

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

### Шаг 3: Удалите старую конфигурацию

Удалите старые файлы конфигурации:
- `.eslintrc`
- `.eslintrc.js`
- `.eslintrc.json`
- `.eslintrc.yaml`

### Шаг 4: Обновите скрипты

Если у вас есть npm-скрипты с `--ext`, обновите их:

```json
// До
"lint": "eslint --ext .js,.ts,.tsx src/"

// После
"lint": "eslint src/"
```

### Шаг 5: Перенесите кастомные опции

Если у вас были кастомные опции правил в v1.x:

```json
// v1.x - СТАРОЕ
{
  "rules": {
    "@conarti/feature-sliced/layers-slices": ["error", {
      "allowTypeImports": true
    }],
    "@conarti/feature-sliced/public-api": ["error", {
      "level": "segments"
    }]
  }
}
```

Преобразуйте их в новый формат:

```js
// v2.0 - НОВОЕ
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layersSlices: {
      allowTypeImports: true,
    },
    publicApi: {
      level: 'segments',
    },
  }),
];
```

## Новые возможности в v2.0

### Отключение отдельных правил

Теперь можно отключать правила, установив их в `false`:

```js
featureSliced({
  absoluteRelative: false,
  sortImports: false,
});
```

### Новые опции ignorePatterns

Все правила теперь поддерживают `ignorePatterns` и `ignoreInFilesPatterns`:

```js
featureSliced({
  layersSlices: {
    ignorePatterns: ['**/legacy/**/*'],
    ignoreInFilesPatterns: ['**/*.test.ts'],
  },
});
```

### Несколько конфигураций сортировки импортов

Новые опции сортировки:
- `recommended` (по умолчанию)
- `with-newlines`
- `with-type-group`
- `with-newlines-and-type-group`

```js
featureSliced({
  sortImports: 'with-newlines-and-type-group',
});
```

## Решение проблем

### "ESLint couldn't find the plugin"

Убедитесь, что используете ESLint 9 и правильный импорт:

```js
// Правильно
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

// Неправильно
const featureSliced = require('@conarti/eslint-plugin-feature-sliced');
```

### "Config must be an array"

Функция плагина возвращает массив, не оборачивайте его дополнительно:

```js
// Правильно
export default [
  featureSliced(),
];

// Неправильно
export default [
  [featureSliced()],
];
```

### Конфликты import/order

Если видите конфликты с сортировкой импортов, отключите встроенную сортировку:

```js
featureSliced({
  sortImports: false,
});
```

## Нужна помощь?

Если столкнулись с проблемами при миграции:

1. Проверьте [GitHub Issues](https://github.com/conarti/eslint-plugin-feature-sliced/issues)
2. Откройте новый issue с вашей конфигурацией и сообщениями об ошибках
