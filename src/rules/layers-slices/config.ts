export const enum ERROR_MESSAGE_ID {
  CAN_NOT_IMPORT = 'can-not-import',
}

export type MessageIds = typeof ERROR_MESSAGE_ID[keyof typeof ERROR_MESSAGE_ID];

export type Options = [
  {
    allowTypeImports: boolean;
    ignorePatterns: string[];
  },
];

