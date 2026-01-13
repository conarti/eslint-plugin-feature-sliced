# absolute-relative

Проверяет, что импорты используют правильный тип пути (абсолютный или относительный) согласно принципам FSD.

**Имя правила:** `@conarti/feature-sliced/absolute-relative`

## Описание правила

Это правило обеспечивает соглашения о путях в Feature-Sliced Design:

- **Внутри одного слайса** → относительные пути (`./`, `../`)
- **Между разными слайсами/слоями** → абсолютные пути

Это обеспечивает чёткие границы между модулями и упрощает рефакторинг.

## Примеры

### ❌ Неправильно

```js
// файл: src/features/login/ui/LoginForm.tsx

// Абсолютный путь для того же слайса — должен быть относительным
import { useLogin } from 'features/login/model';
// Ошибка: There must be relative paths

// Относительный путь для другого слоя — должен быть абсолютным
import { Button } from '../../../shared/ui';
// Ошибка: There must be absolute paths
```

```js
// файл: src/shared/ui/button/Button.tsx

// Абсолютный путь внутри shared — должен быть относительным
import { Icon } from 'shared/ui/icon';
// Ошибка: There must be relative paths
```

### ✅ Правильно

```js
// файл: src/features/login/ui/LoginForm.tsx

// Относительный путь внутри того же слайса
import { useLogin } from '../model';
import { LoginButton } from './LoginButton';

// Абсолютный путь для разных слоёв
import { Button } from '@/shared/ui';
import { User } from 'entities/user';
```

```js
// файл: src/shared/ui/button/Button.tsx

// Относительные пути внутри shared (без слайсов)
import { Icon } from '../icon';
import { theme } from '../../lib/theme';
```

## Распознавание путей

Правило понимает различные форматы алиасов:

```js
// Все эти пути считаются абсолютными
import { Button } from '@/shared/ui';
import { Button } from '~/shared/ui';
import { Button } from '$shared/ui';
import { Button } from 'shared/ui';
import { Button } from 'src/shared/ui';
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

Glob-паттерны путей импорта для игнорирования.

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

Glob-паттерны файлов, где правило отключено.

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

- Если проект не следует соглашениям FSD о путях
- Для импортов стилей, которые не следуют границам модулей
- В конфигурационных файлах с особыми требованиями к импортам

## Дополнительные материалы

- [FSD Public API](https://feature-sliced.design/docs/reference/public-api)
