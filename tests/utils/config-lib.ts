import type { TSESLint } from '@typescript-eslint/utils';

function setParser(config: any, version: TSESLint.EcmaVersion = 2015): any {
  return {
    ...config,
    languageOptions: {
      ecmaVersion: version,
      sourceType: 'module',
      parser: require('@typescript-eslint/parser'),
    },
  };
}

export const configLib = { setParser };
