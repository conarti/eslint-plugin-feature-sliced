const {
  layersNames,
  segments,
} = require('../../lib/constants');

module.exports.MESSAGE_ID = {
  SHOULD_BE_FROM_PUBLIC_API: 'should-be-from-public-api',
  REMOVE_SUGGESTION: 'remove-suggestion',
};

const layersUnion = layersNames.join('|');
const segmentsUnion = segments.join('|');
module.exports.segmentsElementsRegExp = new RegExp(
  `(?<layer>(?<=(${layersUnion})))\\/(?<slice>([\\w-]*\\/)+)(?<segment>${segmentsUnion})(\\.\\w+)?\\/*(?<segmentFiles>.*)`,
);

module.exports.IGNORED_LAYERS = new Set([
  'app',
  'shared',
]);
