const {
  canValidate,
  isIgnored,
} = require('../../../lib/helpers');
const { ERROR_MESSAGE_ID } = require('../constants');
const { shouldBeRelative } = require('./should-be-relative');
const { shouldBeAbsolute } = require('./should-be-absolute');
const { extractPathsInfo } = require('./extract-paths-info');

module.exports.validateAndReport = function (node, context, ruleOptions, options = {}) {
  const { needCheckForAbsolute = true } = options;

  if (!canValidate(node)) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);

  if (isIgnored(pathsInfo.currentFilePath, ruleOptions.ignoreInFilesPatterns)) {
    return;
  }

  if (shouldBeRelative(pathsInfo)) {
    context.report({
      node: node.source,
      messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
    });
  }

  if (needCheckForAbsolute && shouldBeAbsolute(pathsInfo)) {
    context.report({
      node: node.source,
      messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
    });
  }
};
