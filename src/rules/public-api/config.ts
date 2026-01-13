import type { TSESLint } from '@typescript-eslint/utils';

export enum MESSAGE_ID {
  SHOULD_BE_FROM_PUBLIC_API = 'should-be-from-public-api',
  REMOVE_SUGGESTION = 'remove-suggestion',
  LAYERS_PUBLIC_API_NOT_ALLOWED = 'layers-public-api-not-allowed',
  // FROM_INVALID_STRUCTURE = 'from-invalid-structure'
}

export enum VALIDATION_LEVEL {
  SEGMENTS = 'segments',
  SLICES = 'slices',
}

export type MessageIds = MESSAGE_ID;

export type Options = [
  {
    level: VALIDATION_LEVEL;
    ignorePatterns: string[];
    ignoreInFilesPatterns: string[];
  },
];

export type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, Options>>;
