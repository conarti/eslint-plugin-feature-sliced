const {
  canValidate,
  isIgnored,
  extractRuleOptions,
  extractPathsInfo,
} = require('../../../lib/helpers');
const { ERROR_MESSAGE_ID } = require('../constants');
const { shouldBeRelative } = require('./should-be-relative');
const { shouldBeAbsolute } = require('./should-be-absolute');

module.exports.validateAndReport = function (node, context, options = { needCheckForAbsolute: true }) {
  if (!canValidate(node)) {
    return;
  }

  const userDefinedRuleOptions = extractRuleOptions(context);
  const pathsInfo = extractPathsInfo(node, context);

  if (isIgnored(pathsInfo.currentFilePath, userDefinedRuleOptions.ignoreInFilesPatterns)) {
    return;
  }

  if (shouldBeRelative(pathsInfo)) {
    context.report({
      node: node.source,
      messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
    });
  }

  if (options.needCheckForAbsolute && shouldBeAbsolute(pathsInfo)) {
    context.report({
      node: node.source,
      messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
    });
  }
};
