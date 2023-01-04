# eslint-plugin-fsd-react

Feature-sliced design methodology plugin for react

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-conarti-fsd`:

```sh
npm install eslint-plugin-conarti-fsd --save-dev
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
    "conarti-fsd/rule-name": 2
  }
}
```

## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


