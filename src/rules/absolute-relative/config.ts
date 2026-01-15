import type { TSESLint } from '@typescript-eslint/utils';

export const ERROR_MESSAGE_ID = {
  MUST_BE_RELATIVE_PATH: 'must-be-relative-path',
  MUST_BE_ABSOLUTE_PATH: 'must-be-absolute-path',
} as const;

export type MessageIds = typeof ERROR_MESSAGE_ID[keyof typeof ERROR_MESSAGE_ID];

export type Options = [
  {
    ignoreImports: string[];
    ignoreFiles: string[];
  },
];

export type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, Options>>;
