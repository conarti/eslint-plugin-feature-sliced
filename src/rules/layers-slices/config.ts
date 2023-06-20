import { type TSESLint } from '@typescript-eslint/utils';

export const enum ERROR_MESSAGE_ID {
  CAN_NOT_IMPORT = 'can-not-import',
}

export type MessageIds = ERROR_MESSAGE_ID;

export type Options = [
  {
    allowTypeImports: boolean;
    ignorePatterns?: string[];
    ignoreInFilesPatterns?: string[];
  },
];

export type RuleContext = Readonly<TSESLint.RuleContext<MessageIds, Options>>;
