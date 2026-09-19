import type { TSESLint } from '@typescript-eslint/utils';

export const ERROR_MESSAGE_ID = {
  CAN_NOT_IMPORT: 'can-not-import',
  INVALID_CROSS_IMPORT: 'invalid-cross-import',
  PASS_THROUGH_REEXPORT: 'pass-through-reexport',
} as const;

export type MessageIds = typeof ERROR_MESSAGE_ID[keyof typeof ERROR_MESSAGE_ID];

export type Options = [
  {
    allowTypeImports: boolean;
    allowPassThroughReexports: boolean;
    ignoreImports: string[];
    ignoreFiles: string[];
  },
];

export type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, Options>>;
