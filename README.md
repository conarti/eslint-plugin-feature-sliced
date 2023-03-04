# eslint-plugin-conarti-fsd

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

Next, install `eslint-plugin-conarti-fsd` and dependencies:

```sh
npm install -D eslint-plugin-conarti-fsd eslint-plugin-import
# or by yarn
yarn add -D eslint-plugin-conarti-fsd eslint-plugin-import
```

## Usage

Add `conarti-fsd` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-`
prefix:

```json
{
  "plugins": [
    "conarti-fsd"
  ]
}
```

Then enable rules:

```json
{
  "extends": [
    "plugin:conarti-fsd/recommended"
  ]
}
```

## Customization

You can use _warnings_ instead of _errors_ for specific rules. Or turn off certain rules:

```json
{
  "rules": {
    "conarti-fsd/layers-slices": "warn",
    "conarti-fsd/absolute-relative": "off",
    "conarti-fsd/public-api": "warn",
    "import/order": "warn"
  }
}
```

If you don't want to use the 'import/order' rule, you can choose not to install the 'eslint-plugin-import' package.
And also you will have to configure all the rules separately, without using the config.
Recommended settings:
```json
{
  "rules": {
    "conarti-fsd/layers-slices": ["error", { 
      "allowTypeImports": true
    }],
    "conarti-fsd/absolute-relative": "error",
    "conarti-fsd/public-api": "error"
  }
}
```

## Rules

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name | Description | 🔧 |
| :----------------------------------------------------- | :--------------------------------------- | :- |
| [import/order](rules/import-order/README.md)             | | 🔧 |
| [conarti-fsd/layers-slices](rules/layers-slices/README.md)           | Checks layer imports | |
| [conarti-fsd/absolute-relative](rules/absolute-relative/README.md)             | Checks for absolute and relative paths | |
| [conarti-fsd/public-api](rules/public-api/README.md) | Check for module imports from public api | 🔧 |
