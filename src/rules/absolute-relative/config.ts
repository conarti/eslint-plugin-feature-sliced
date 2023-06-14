import { type TSESLint } from '@typescript-eslint/utils';

export const enum ERROR_MESSAGE_ID {
  MUST_BE_RELATIVE_PATH = 'must-be-relative-path',
  MUST_BE_ABSOLUTE_PATH = 'must-be-absolute-path',
}

export type MessageIds = ERROR_MESSAGE_ID;

export type Options = [
  {
    ignoreInFilesPatterns?: string[],
  },
];

export type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, Options>>;
