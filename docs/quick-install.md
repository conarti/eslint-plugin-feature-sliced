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

## Usage

Add `@conarti/feature-sliced/recommended` to `extends` section of your `.eslintrc` configuration file.

```json{3}
{
  "extends": [
    "plugin:@conarti/feature-sliced/recommended"
  ]
}
```

## About `recommended` config

The recommended config was created to quickly set up all the rules.
It contains the settings recommended by the methodology and the author.
With it, you only need to install the dependencies and add one line to the eslint configuration.

However, if you need to customize the rules in more detail for the specifics of the project,
then follow the [Advanced configuration](/advanced-configuration) steps.
