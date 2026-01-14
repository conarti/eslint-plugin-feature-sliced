# Getting Started

`@conarti/eslint-plugin-feature-sliced` is an ESLint plugin that helps you follow [Feature-Sliced Design](https://feature-sliced.design/) methodology in your projects.

## What is Feature-Sliced Design?

Feature-Sliced Design (FSD) is an architectural methodology for frontend projects. It provides a set of rules and best practices for organizing code in a scalable and maintainable way.

The main concepts are:

- **Layers** - vertical slices of the application (app, processes, pages, widgets, features, entities, shared)
- **Slices** - business units within layers
- **Segments** - technical divisions within slices (ui, model, lib, api, config)

For more details, visit [feature-sliced.design](https://feature-sliced.design/).

## Installation

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

## Requirements

- Node.js >= 18.0.0
- ESLint >= 9.0.0

## Basic Usage

Create or update your `eslint.config.js`:

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

This enables all rules with default settings.

## What's Included

The plugin provides 4 rules:

| Rule | Description |
|------|-------------|
| [layers-slices](/rules/layers-slices) | Validates imports between layers according to FSD hierarchy |
| [absolute-relative](/rules/absolute-relative) | Ensures correct path types (relative/absolute) |
| [public-api](/rules/public-api) | Enforces imports from public API only |
| [import-order](/rules/import-order) | Sorts imports by FSD layers |

## Next Steps

- [Configuration](/configuration) - customize the plugin
- [Rules](/rules/) - learn about each rule
- [Migration Guide](/migration-v2) - upgrade from v1 to v2
