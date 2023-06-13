// eslint-disable-next-line filenames-simple/naming-convention
"use strict";

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    'plugin:jest/recommended',
    'plugin:jest-formatting/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
    'filenames-simple',
    'unused-imports',
  ],
  env: {
    node: true,
  },
  rules: {
    'filenames-simple/naming-convention': ['error', { rule: 'kebab-case' }],
    'unused-imports/no-unused-imports': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2],
    'brace-style': 'error',
    'semi': ['error', 'always'],
    'object-property-newline': 'error',
    'object-curly-spacing': ['error', 'always'],
    /* TODO: update this configuration for ts imports */
    'object-curly-newline': ['error', {
      'ObjectExpression': {
        multiline: true,
        minProperties: 2,
        consistent: true,
      },
      'ObjectPattern': {
        multiline: true,
        minProperties: 2,
      },
      'ImportDeclaration': {
        multiline: true,
        consistent: true,
      },
      'ExportDeclaration': {
        multiline: true,
        minProperties: 2,
        consistent: true,
      },
    }],
    /* TODO: add airbnb config or something like this */
    '@typescript-eslint/consistent-type-imports': ['error'],
  },
  ignorePatterns: [
    'dist',
  ],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json'],
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
    },
  ],
};
