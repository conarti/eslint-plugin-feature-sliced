const {
  isIgnored,
  extractRuleOptions,
  extractPathsInfo,
} = require('../../../lib/helpers');
const { canImportLayer } = require('./can-import-layer');
const errorsLib = require('./errors-lib');

module.exports.validateAndReport = function (node, context) {
  const pathsInfo = extractPathsInfo(node, context);
  const userDefinedRuleOptions = extractRuleOptions(context);

  if (isIgnored(pathsInfo.importPath, userDefinedRuleOptions.ignorePatterns)) {
    return;
  }

  if (!canImportLayer(pathsInfo, userDefinedRuleOptions)) {
    errorsLib.reportCanNotImportLayer(context, node, pathsInfo);
  }
};
