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

Next, install `@conarti/eslint-plugin-feature-sliced`:

```sh
npm i -D @conarti/eslint-plugin-feature-sliced
```

Note: the plugin may conflict with other import sorting plugins installed in your project. 
If you do not want to use this plugin's sorting, disable it. More about this below

## Usage

For simple use with loose settings, just call the function:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
    featureSliced(),
]
```

## Customisation

You can also manage any rule and disable them:

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
    featureSliced({
        /* Enables public api check in segments */
        publicApi: { level: 'segments' },
        /* Uses a different import sorter. You can disable it and use your own plugins and configurations */
        sortImports: 'with-newlines',
        /* This is how you can completely disable the rule */
        absoluteRelative: false,
        layersSlices: {
            /* This is how you can disable the rule for imports in any files (ignore paths in code) */
            ignorePatterns: [
                /**
                 * Please note that the plugin reads the entire file path from the root of your system, not the project.
                 * That's why we added "**" to the beginning.
                 */
                "**/src/components/**/*"
            ],
            /* This is how you can disable the rule for files or folders (ignore all paths in files or folders) */
            ignoreInFilesPatterns: [
                /* Do not check imports like "import foo from '@/app/some-module/foo'" */
                "@/app/some-module/*",
            ],
        },
    }),
]
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
