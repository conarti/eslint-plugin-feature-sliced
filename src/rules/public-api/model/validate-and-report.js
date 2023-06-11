const { extractPathsInfo } = require('../../../lib/fsd-lib');
const {
  canValidate,
  extractRuleOptions,
} = require('../../../lib/rule-lib');
const { IGNORED_LAYERS } = require('../config');
const { isPublicApi } = require('./is-public-api');
const errorsLib = require('./errors-lib');

module.exports.validateAndReport = function (node, context) {
  if (!canValidate(node)) {
    return;
  }

  const ruleOptions = extractRuleOptions(context);
  const pathsInfo = extractPathsInfo(node, context);

  const isIgnoredLayer = IGNORED_LAYERS.has(pathsInfo.importLayer);

  if (pathsInfo.isUnknownLayer || isIgnoredLayer) {
    return;
  }

  if (!isPublicApi(pathsInfo, ruleOptions)) {
    errorsLib.reportShouldBeFromPublicApi(node, context, pathsInfo);
  }
};
