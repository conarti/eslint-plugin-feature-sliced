import type { TSESLint } from '@typescript-eslint/utils';

export const ERROR_MESSAGE_ID = {
  NO_CROSS_SEGMENT_REEXPORT: 'no-cross-segment-reexport',
  MOVE_TO_SLICE_PUBLIC_API_SUGGESTION: 'move-to-slice-public-api-suggestion',
} as const;

export type MessageIds = typeof ERROR_MESSAGE_ID[keyof typeof ERROR_MESSAGE_ID];

export type Options = [
  {
    ignoreImports: string[];
    ignoreFiles: string[];
  },
];

export type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, Options>>;
