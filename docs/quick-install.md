---
title: Quick install
---

# Quick Install

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i -D eslint
```

Next, install `@conarti/eslint-plugin-feature-sliced` and dependencies:

```sh
npm i -D @conarti/eslint-plugin-feature-sliced eslint-plugin-import
```
or by yarn
```sh
yarn add -D @conarti/eslint-plugin-feature-sliced eslint-plugin-import
```

::: info
`eslint-plugin-import` is optional.
But this page provides a quick start guide
and uses a ready-made recommended configuration that requires this plugin to be installed.
You can skip installing this plugin if you don't need to sort imports in your code.
See [Advanced configuration](/advanced-configuration) for more details.
:::

## Usage

Add `@conarti/feature-sliced/recommended` to `extends` section of your `.eslintrc` configuration file.
It enables all rules and additional recommended configs of other eslint plugins, like `eslint-plugin-import`.

```json{3}
{
  "extends": [
    "plugin:@conarti/feature-sliced/recommended"
  ]
}
```
