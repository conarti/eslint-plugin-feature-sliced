/* eslint-disable filenames-simple/naming-convention */
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
    'modules-newlines',
  ],
  env: {
    node: true,
  },
  rules: {
    'filenames-simple/naming-convention': ['error', { rule: 'kebab-case' }],
    'unused-imports/no-unused-imports': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2],
    'brace-style': 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'object-property-newline': 'error',
    'max-len': ['error', 150],
    'object-curly-spacing': ['error', 'always'],
    'modules-newlines/import-declaration-newline': 'error',
    'modules-newlines/export-declaration-newline': 'error',
    'object-curly-newline': ['error', {
      ObjectExpression: {
        multiline: true,
        minProperties: 2,
        consistent: true,
      },
      ObjectPattern: {
        multiline: true,
        minProperties: 2,
      },
      ImportDeclaration: {
        multiline: true,
        consistent: true,
      },
      ExportDeclaration: {
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
    '@typescript-eslint/consistent-type-imports': ['error', {
      fixStyle: 'inline-type-imports',
    }],
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'import/no-extraneous-dependencies': 'off',
    'prefer-destructuring': 'off',
    'linebreak-style': ['error', 'unix'],
    complexity: ['error', 10],
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
    {
      files: ['./src/rules/*/index.ts'],
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: ['scripts/**/*'],
      rules: {
        'no-console': 'off',
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
        alwaysTryTypes: true,
        project: '<root>/tsconfig.eslint.json',
      },
    },
  },
};
