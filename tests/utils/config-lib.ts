import type { TSESLint } from '@typescript-eslint/utils';
import * as tseslintParser from '@typescript-eslint/parser';

function setParser(config: any, version: TSESLint.EcmaVersion = 2015): any {
  return {
    ...config,
    languageOptions: {
      ecmaVersion: version,
      sourceType: 'module',
      parser: tseslintParser,
    },
  };
}

export const configLib = { setParser };
