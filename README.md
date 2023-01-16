# eslint-plugin-conarti-fsd

Feature-sliced design methodology plugin for any frameworks.

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
    "plugin:conarti-fsd/all"
  ]
}
```

## Customization

You can use _warnings_ instead of _errors_ for specific rules. Or turn off certain rules:

```json
{
  "rules": {
    "conarti-fsd/layer-imports": "warn",
    "conarti-fsd/path-checker": "warn",
    "conarti-fsd/public-api-imports": "warn",
    "import/order": "off"
  }
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name | Description | 🔧 |
| :----------------------------------------------------- | :--------------------------------------- | :- |
| [import-order](docs/rules/import-order.md)             | | 🔧 |
| [layer-imports](docs/rules/layer-imports.md)           | Checks layer imports | |
| [path-checker](docs/rules/path-checker.md)             | Checks for absolute and relative paths | |
| [public-api-imports](docs/rules/public-api-imports.md) | Check for module imports from public api | 🔧 |

<!-- end auto-generated rules list -->


