import type { TSESLint } from '@typescript-eslint/utils';

export const MESSAGE_ID = {
  SHOULD_BE_FROM_PUBLIC_API: 'should-be-from-public-api',
  REMOVE_SUGGESTION: 'remove-suggestion',
  LAYERS_PUBLIC_API_NOT_ALLOWED: 'layers-public-api-not-allowed',
} as const;

export const VALIDATION_LEVEL = {
  SEGMENTS: 'segments',
  SLICES: 'slices',
} as const;

export type MessageIds = typeof MESSAGE_ID[keyof typeof MESSAGE_ID];

export type ValidationLevel = typeof VALIDATION_LEVEL[keyof typeof VALIDATION_LEVEL];

export type Options = [
  {
    level: ValidationLevel;
    ignorePatterns: string[];
    ignoreInFilesPatterns: string[];
  },
];

export type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, Options>>;
