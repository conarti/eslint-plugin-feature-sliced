const MESSAGE_ID = {
  SHOULD_BE_FROM_PUBLIC_API: 'should-be-from-public-api',
  REMOVE_SUGGESTION: 'remove-suggestion',
};

const IGNORED_LAYERS = new Set([
  'app',
  'shared',
]);

const VALIDATION_LEVEL = {
  SEGMENTS: 'segments',
  SLICES: 'slices',
};

module.exports = {
  MESSAGE_ID,
  IGNORED_LAYERS,
  VALIDATION_LEVEL,
};
