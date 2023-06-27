# @conarti/eslint-plugin-feature-sliced

Feature-sliced design methodology plugin.

_Attention: the plugin is being actively developed and is in **beta**.
The names of rules and configurations may change in new versions.
If you find a bug, please open an issue or pull request.
Feel free to contribute_

## Features

- Works with any framework

- Support for **any aliases** out of the box

```javascript
import { AppButton } from "~/shared/ui/app-button";
import { AppButton } from "@/shared/ui/app-button";
import { AppButton } from "@shared/ui/app-button";
import { AppButton } from "$shared/ui/app-button";
import { AppButton } from "$@#$%%shared/ui/app-button";
```

- Checks for absolute and relative paths

```javascript
// file: src/widgets/TheHeader/ui/TheHeader.stories.tsx

import { TheHeader } from './TheHeader'; // valid
import { TheHeader } from 'src/widgets/TheHeader'; // error: should relative
import { TheHeader } from 'widgets/TheHeader'; // error: should relative
import { useBar } from '../../../shared/hooks'; // error: should absolute
```

- Checks for imports from public api and fix them

```javascript
// file: src/features/search-articles/...

import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/file.ts'; // error
// fix: import { addCommentFormActions, addCommentFormReducer } from 'entities/Article';
```

- Sort imports

```javascript
import axios from "axios";                           // 1) external libs
import { Header } from "widgets/header";             // 2.1) Layers: widgets
import { Zero } from "widgets/zero";                 // 2.1) Layers: widget 
import { LoginForm } from "features/login-form";     // 2.2) Layers: features
import { globalEntities } from "entities";           // 2.4) Layers: entities
import { authModel } from "entities/auth";           // 2.4) Layers: entities
import { Cart } from "entities/cart";                // 2.4) Layers: entities 
import { One } from "entities/one";                  // 2.4) Layers: entities 
import { Two } from "entities/two";                  // 2.4) Layers: entities
import { debounce } from "shared/lib/fp";            // 2.5) Layers: shared
import { Button } from "shared/ui";                  // 2.5) Layers: shared
import { Input } from "shared/ui";                   // 2.5) Layers: shared
import { data } from "../fixtures";                  // 3) parent
import { getSmth } from "./lib";                     // 4) sibling
```

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@conarti/eslint-plugin-feature-sliced` and dependencies:

```sh
npm install -D @conarti/eslint-plugin-feature-sliced eslint-plugin-import
# or by yarn
yarn add -D @conarti/eslint-plugin-feature-sliced eslint-plugin-import
```

Note: 'eslint-plugin-import' is optional. You can skip installing this plugin if you don't need to sort imports in your code.

## Quick Usage

Add `@conarti/feature-sliced/recommended` to extends section of your `.eslintrc` configuration file. 
It enables all rules and additional recommended configs of other eslint plugins, like `eslint-plugin-import`. 

```json
{
  "extends": [
    "plugin:@conarti/feature-sliced/recommended"
  ]
}
```

## Customisation

If you want to use only plugin rules, add `@conarti/feature-sliced/rules` instead.

```json
{
  "extends": [
    "plugin:@conarti/feature-sliced/rules"
  ]
}
```

If you only want to use certain rules, you can add them individually. To do this, you need to add `@conarti/feature-sliced` to the 'plugins'
section of the configuration file and add the desired rules to the 'rules' section. Also now you don't need to use the 'extends' section like before

```json
{
  "plugins": [
    "@conarti/feature-sliced"
  ],
  "rules": {
    "@conarti/feature-sliced/layers-slices": "error",
    "@conarti/feature-sliced/absolute-relative": "error",
    "@conarti/feature-sliced/public-api": "error"
  }
}
```

## Rules

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).
💡 Suggestion fix (no automatic fix)

| Name                                                                                | Description                               | 🔧 |
|:------------------------------------------------------------------------------------|:------------------------------------------|:---|
| [@conarti/feature-sliced/layers-slices](docs/rules/layers-slices/README.md)         | Checks layer imports                      |    |
| [@conarti/feature-sliced/absolute-relative](docs/rules/absolute-relative/README.md) | Checks for absolute and relative paths    |    |
| [@conarti/feature-sliced/public-api](docs/rules/public-api/README.md)               | Check for module imports from public api  | 💡 |
| import/order                                                                        | Sort imports using 'eslint-plugin-import' | 🔧 |
