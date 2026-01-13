# Начало работы

`@conarti/eslint-plugin-feature-sliced` — ESLint плагин, который помогает следовать методологии [Feature-Sliced Design](https://feature-sliced.design/) в ваших проектах.

## Что такое Feature-Sliced Design?

Feature-Sliced Design (FSD) — архитектурная методология для фронтенд-проектов. Она предоставляет набор правил и лучших практик для организации кода в масштабируемом и поддерживаемом виде.

Основные концепции:

- **Слои (Layers)** — вертикальные срезы приложения (app, processes, pages, widgets, features, entities, shared)
- **Слайсы (Slices)** — бизнес-единицы внутри слоёв
- **Сегменты (Segments)** — техническое разделение внутри слайсов (ui, model, lib, api, config)

Подробнее на [feature-sliced.design](https://feature-sliced.design/).

## Установка

::: code-group

```sh [npm]
npm install -D @conarti/eslint-plugin-feature-sliced eslint
```

```sh [pnpm]
pnpm add -D @conarti/eslint-plugin-feature-sliced eslint
```

```sh [yarn]
yarn add -D @conarti/eslint-plugin-feature-sliced eslint
```

:::

## Требования

- Node.js >= 18.0.0
- ESLint >= 9.0.0

## Базовое использование

Создайте или обновите `eslint.config.js`:

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

Это включит все правила с настройками по умолчанию.

## Что включено

Плагин предоставляет 4 правила:

| Правило | Описание |
|---------|----------|
| [layers-slices](/en/rules/layers-slices) | Проверяет импорты между слоями согласно иерархии FSD |
| [absolute-relative](/en/rules/absolute-relative) | Проверяет тип пути (относительный/абсолютный) |
| [public-api](/en/rules/public-api) | Требует импорты только из public API |
| [import-order](/en/rules/import-order) | Сортирует импорты по слоям FSD |

## Следующие шаги

- [Конфигурация](/ru/configuration) — настройка плагина
- [Правила](/ru/rules/) — подробнее о каждом правиле
- [Миграция](/ru/migration-v2) — обновление с v1 на v2
