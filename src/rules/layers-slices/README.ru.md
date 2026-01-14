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

### Паттерн @x для кросс-импортов

Паттерн `@x` позволяет контролируемые кросс-импорты между слайсами в слое `entities`. Это полезно, когда сущности имеют легитимные зависимости друг от друга.

#### Синтаксис

```
entities/<исходный-слайс>/@x/<целевой-слайс>
```

Исходный слайс экспортирует определённые модули для целевого слайса через специальную директорию `@x`.

#### ✅ Правильные @x импорты

```js
// файл: src/entities/session/model.ts
import { User } from 'entities/user/@x/session';
// OK: session может импортировать из cross-import API пользователя

import { userApi } from '@/entities/user/@x/session';
// OK: alias пути поддерживаются
```

#### ❌ Неправильные @x импорты

```js
// файл: src/features/auth/model.ts
import { User } from 'entities/user/@x/auth';
// Ошибка: @x только для кросс-импортов между entities, не из других слоёв

// файл: src/entities/session/model.ts
import { userModel } from 'entities/user/@x/session/model';
// Ошибка: Вложенные пути после @x не разрешены
```

#### Как использовать @x

1. Создайте директорию `@x` в исходном слайсе
2. Создайте файл с именем целевого слайса (например, `session.ts`)
3. Экспортируйте только то, что нужно целевому слайсу

```
entities/
├── user/
│   ├── @x/
│   │   └── session.ts    # Экспорты для слайса session
│   ├── model/
│   └── index.ts
└── session/
    ├── model.ts          # Может импортировать из entities/user/@x/session
    └── index.ts
```

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
  ignoreImports?: string[];
  ignoreFiles?: string[];
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

### ignoreImports

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны для путей импортов, которые нужно игнорировать.

```js
featureSliced({
  layersSlices: {
    ignoreImports: ['**/legacy/**/*', '@/shared/deprecated/*'],
  },
});
```

### ignoreFiles

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны для файлов, в которых правило отключено.

```js
featureSliced({
  layersSlices: {
    ignoreFiles: ['**/tests/**/*', '**/*.test.ts', '**/*.stories.tsx'],
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
      ignoreImports: ['**/mocks/**/*'],
      ignoreFiles: ['**/*.test.ts'],
    },
  }),
];
```

## Когда не использовать

- При миграции на FSD — используйте `ignoreImports`
- В тестовых файлах, которым нужны кросс-слойные импорты — используйте `ignoreFiles`
- В Storybook stories — используйте `ignoreFiles`

## Дополнительная информация

- [FSD Layers](https://feature-sliced.design/docs/reference/units/layers)
- [FSD Slices](https://feature-sliced.design/docs/reference/units/slices)
