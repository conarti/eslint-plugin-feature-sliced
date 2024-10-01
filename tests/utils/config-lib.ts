import type { TSESLint } from '@typescript-eslint/utils';

function setParser(config: any, version: TSESLint.EcmaVersion = 2015): any {
  return {
    ...config,
    parserOptions: {
      ecmaVersion: version,
      sourceType: 'module',
    },
  };
}

export const configLib = { setParser };
