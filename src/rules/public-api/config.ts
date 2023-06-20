import type { TSESLint } from '@typescript-eslint/utils';

export const enum MESSAGE_ID {
  SHOULD_BE_FROM_PUBLIC_API = 'should-be-from-public-api',
  REMOVE_SUGGESTION = 'remove-suggestion',
  LAYERS_PUBLIC_API_NOT_ALLOWED = 'layers-public-api-not-allowed'
}

/* TODO probably @duplicate of 'isInsideShared'/'isInsideApp' in extractPathsInfo */
export const IGNORED_LAYERS = [
  'app',
  'shared',
];

export const enum VALIDATION_LEVEL {
  SEGMENTS = 'segments',
  SLICES = 'slices',
}

export type MessageIds = MESSAGE_ID;

export type Options = [
  {
    level: VALIDATION_LEVEL
  },
];

export type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, Options>>;
