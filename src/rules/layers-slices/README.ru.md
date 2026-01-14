# Проверка импортов между слоями и слайсами (`@conarti/feature-sliced/layers-slices`)

Валидирует импорты между слоями и слайсами согласно методологии Feature-Sliced Design.

## Описание правила

Это правило проверяет два основных принципа FSD:

1. **Иерархия слоёв** — нижние слои не могут импортировать из верхних
2. **Изоляция слайсов** — слайсы внутри одного слоя не могут импортировать друг из друга

### Иерархия слоёв

Слои упорядочены от нижнего к верхнему:

```
shared → entities → features → widgets → pages → processes → app
```

Слой может импортировать только из слоёв ниже себя.

### Изоляция слайсов

В слоях со слайсами (`entities`, `features`, `widgets`, `pages`, `processes`) один слайс не может импортировать из другого слайса того же слоя.

### Неправильно

```js
// файл: src/entities/user/model.ts
import { Article } from 'entities/article';
// Ошибка: Нельзя импортировать из другого слайса того же слоя

import { LoginForm } from 'features/login';
// Ошибка: Нельзя импортировать из верхнего слоя
```

```js
// файл: src/shared/ui/button.ts
import { User } from 'entities/user';
// Ошибка: Нельзя импортировать из верхнего слоя
```

### Правильно

```js
// файл: src/features/login/ui.tsx
import { User } from 'entities/user';
// OK: features может импортировать из entities

import { Button } from 'shared/ui';
// OK: features может импортировать из shared
```

```js
// файл: src/app/App.tsx
import { Router } from 'app/providers/router';
// OK: импорты внутри слоя app разрешены
```

```js
// файл: src/features/login/model.ts
import type { User } from 'entities/user';
// OK: type-импорты разрешены (с allowTypeImports: true)
```

## Опции

```ts
interface Options {
  allowTypeImports?: boolean;
  ignorePatterns?: string[];
  ignoreInFilesPatterns?: string[];
}
```

### allowTypeImports

Тип: `boolean`
По умолчанию: `true`

Разрешает type-only импорты из любого слоя. Рекомендуется для TypeScript проектов.

```ts
// С allowTypeImports: true (по умолчанию)
import type { User } from 'entities/user'; // OK в слое shared
```

**Примечание:** Работает только с явным ключевым словом `type`. Обычные импорты типов всё равно проверяются.

### ignorePatterns

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны для путей импортов, которые нужно игнорировать.

```js
featureSliced({
  layersSlices: {
    ignorePatterns: ['**/legacy/**/*', '@/shared/deprecated/*'],
  },
});
```

### ignoreInFilesPatterns

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны для файлов, в которых правило отключено.

```js
featureSliced({
  layersSlices: {
    ignoreInFilesPatterns: ['**/tests/**/*', '**/*.test.ts', '**/*.stories.tsx'],
  },
});
```

## Пример конфигурации

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layersSlices: {
      allowTypeImports: true,
      ignorePatterns: ['**/mocks/**/*'],
      ignoreInFilesPatterns: ['**/*.test.ts'],
    },
  }),
];
```

## Когда не использовать

- При миграции на FSD — используйте `ignorePatterns`
- В тестовых файлах, которым нужны кросс-слойные импорты — используйте `ignoreInFilesPatterns`
- В Storybook stories — используйте `ignoreInFilesPatterns`

## Дополнительная информация

- [FSD Layers](https://feature-sliced.design/docs/reference/units/layers)
- [FSD Slices](https://feature-sliced.design/docs/reference/units/slices)
