const { layersNames } = require('../../lib/constants');

module.exports.MESSAGE_ID = {
  SHOULD_BE_FROM_PUBLIC_API: 'should-be-from-public-api',
  REMOVE_SUGGESTION: 'remove-suggestion',
};

module.exports.segmentsElementsRegExp = new RegExp(`(?<=(${layersNames.join('|')})\\/[\\w-]*\\/).*`);
