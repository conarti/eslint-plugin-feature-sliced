const micromatch = require('micromatch');
const { shouldBeRelative } = require('./should-be-relative');
const { ERROR_MESSAGE_ID } = require('../constants');
const { shouldBeAbsolute } = require('./should-be-absolute');
const { extractPathsInfo } = require('./extract-paths-info');

module.exports.validateAndReport = function (node, context, ruleOptions, options = {}) {
  const { ignoreInFilesPatterns = null } = ruleOptions;
  const { needCheckForAbsolute = true } = options;

  if (node.source === null) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);

  if (ignoreInFilesPatterns && micromatch.isMatch(pathsInfo.currentFilePath, ignoreInFilesPatterns)) {
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
