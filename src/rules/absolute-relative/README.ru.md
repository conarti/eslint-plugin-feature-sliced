# Проверка абсолютных и относительных путей (`@conarti/feature-sliced/absolute-relative`)

Проверяет, что импорты используют правильный тип пути (абсолютный или относительный) согласно принципам FSD.

## Описание правила

Это правило проверяет соглашения о путях в Feature-Sliced Design:

- **Внутри одного слайса** → используйте относительные пути (`./`, `../`)
- **Между разными слайсами/слоями** → используйте абсолютные пути

Это обеспечивает чёткие границы между модулями и упрощает рефакторинг.

### Неправильно

```js
// файл: src/features/login/ui/LoginForm.tsx

// Использование абсолютного пути для того же слайса — должен быть относительным
import { useLogin } from 'features/login/model';
// Ошибка: Должны использоваться относительные пути

// Использование относительного пути для другого слоя — должен быть абсолютным
import { Button } from '../../../shared/ui';
// Ошибка: Должны использоваться абсолютные пути
```

```js
// файл: src/shared/ui/button/Button.tsx

// Использование абсолютного пути внутри слоя shared — должен быть относительным
import { Icon } from 'shared/ui/icon';
// Ошибка: Должны использоваться относительные пути
```

### Правильно

```js
// файл: src/features/login/ui/LoginForm.tsx

// Относительный путь внутри одного слайса
import { useLogin } from '../model';
import { LoginButton } from './LoginButton';

// Абсолютный путь для разных слоёв
import { Button } from '@/shared/ui';
import { User } from 'entities/user';
```

```js
// файл: src/shared/ui/button/Button.tsx

// Относительные пути внутри слоя shared (без слайсов)
import { Icon } from '../icon';
import { theme } from '../../lib/theme';
```

## Опции

```ts
interface Options {
  ignorePatterns?: string[];
  ignoreInFilesPatterns?: string[];
}
```

### ignorePatterns

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны для путей импортов, которые нужно игнорировать.

```js
featureSliced({
  absoluteRelative: {
    ignorePatterns: [
      '**/assets/**/*',
      '*.css',
      '*.scss',
    ],
  },
});
```

### ignoreInFilesPatterns

Тип: `string[]`
По умолчанию: `[]`

Glob-паттерны для файлов, в которых правило отключено.

```js
featureSliced({
  absoluteRelative: {
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
    absoluteRelative: {
      ignorePatterns: ['*.css'],
      ignoreInFilesPatterns: ['**/*.test.ts'],
    },
  }),
];
```

## Когда не использовать

- Если ваш проект не следует соглашениям FSD о путях
- Для импортов стилей, которые не следуют границам модулей
- В конфигурационных файлах, которым нужен специфический стиль импортов

## Дополнительная информация

- [FSD Public API](https://feature-sliced.design/docs/reference/public-api)
