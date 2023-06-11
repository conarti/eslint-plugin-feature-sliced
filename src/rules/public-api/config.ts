export const enum MESSAGE_ID {
  SHOULD_BE_FROM_PUBLIC_API = 'should-be-from-public-api',
  REMOVE_SUGGESTION = 'remove-suggestion',
}

export const IGNORED_LAYERS = new Set([
  'app',
  'shared',
]);

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
