// eslint-disable-next-line filenames-simple/naming-convention
'use strict';

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin/recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
    'filenames-simple',
    'unused-imports',
    'import',
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
    'quotes': ['error', 'single', { avoidEscape: true }],
    'object-property-newline': 'error',
    'max-len': ['error', 120],
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
    'import/no-duplicates': ['error'],
    'import/order': ['error', {
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
      'newlines-between': 'never',
      pathGroupsExcludedImportTypes: ['builtin'],
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
    }],
    /* TODO: add airbnb config or something like this */
    '@typescript-eslint/consistent-type-imports': ['error', {
      fixStyle: 'inline-type-imports',
    }],
  },
  ignorePatterns: [
    'dist',
  ],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json'],
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/consistent-type-exports': ['error', {
          fixMixedExportsWithInlineTypeSpecifier: true,
        }],
      },
    },
    {
      files: ['tests/**/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['**/*.test.ts'],
      extends: [
        'plugin:vitest/all',
      ],
    },
    {
      files: ['./src/rules/**/index.test.ts'],
      rules: {
        'vitest/require-hook': 'off',
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
        '.tsx',
      ],
    },
    'import/resolver': {
      typescript: {
        'alwaysTryTypes': true,
        'project': '<root>/tsconfig.eslint.json',
      },
    },
  },
};
