const MESSAGE_ID = {
  SHOULD_BE_FROM_PUBLIC_API: 'should-be-from-public-api',
  REMOVE_SUGGESTION: 'remove-suggestion',
};

const IGNORED_LAYERS = new Set([
  'app',
  'shared',
]);

module.exports = {
  MESSAGE_ID,
  IGNORED_LAYERS,
};
