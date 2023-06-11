const { MESSAGE_ID } = require('../config');
const { getSourceRangeWithoutQuotes } = require('../../../lib/rule-lib');
const { convertToPublicApi } = require('./convert-to-public-api');

function reportShouldBeFromPublicApi(node, context, pathsInfo) {
  const [fixedPath, valueToRemove] = convertToPublicApi(pathsInfo);

  context.report({
    node: node.source,
    messageId: MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
    data: {
      fixedPath,
    },
    suggest: [
      {
        messageId: MESSAGE_ID.REMOVE_SUGGESTION,
        data: {
          valueToRemove,
        },
        fix: (fixer) => fixer.replaceTextRange(getSourceRangeWithoutQuotes(node.source.range), fixedPath),
      },
    ],
  });
}

module.exports = {
  reportShouldBeFromPublicApi,
};
