const {
  canValidate,
  isIgnored,
  extractRuleOptions,
  extractPathsInfo,
} = require('../../../lib/helpers');
const { shouldBeRelative } = require('./should-be-relative');
const { shouldBeAbsolute } = require('./should-be-absolute');
const errorsLib = require('./errors-lib');

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
    errorsLib.reportShouldBeRelative(node, context);
  }

  if (options.needCheckForAbsolute && shouldBeAbsolute(pathsInfo)) {
    errorsLib.reportShouldBeAbsolute(node, context);
  }
};
