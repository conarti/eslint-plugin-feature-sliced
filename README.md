# eslint-plugin-fsd-react

Feature-sliced design methodology plugin for react

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

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "conarti-fsd/layer-imports": "error",
    "conarti-fsd/path-checker": "error",
    "conarti-fsd/public-api-imports": "error"
  }
}
```

To enable all other rules:

```json
{
  "extends": [
    "conarti-fsd"
  ]
}
```

OR

You can partially use the other rules:

```json
{
  "extends": [
    "conarti-fsd/rules/import-order"
  ]
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


