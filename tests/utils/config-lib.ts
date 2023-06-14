import type { TSESLint } from '@typescript-eslint/utils';

const setParser = (config: any, version: TSESLint.EcmaVersion = 2015): any => ({
  ...config,
  parserOptions: {
    'ecmaVersion': version,
    'sourceType': 'module',
  },
});

export const configLib = { setParser };
