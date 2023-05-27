const { ERROR_MESSAGE_ID } = require('../constants');

function reportShouldBeRelative(node, context) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
  });
}

function reportShouldBeAbsolute(node, context) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
  });
}

module.exports = {
  reportShouldBeRelative,
  reportShouldBeAbsolute,
};
