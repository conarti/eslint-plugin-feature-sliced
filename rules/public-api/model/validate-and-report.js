const { extractPathsInfo } = require('../../../lib/fsd-lib');
const { canValidate } = require('../../../lib/rule-lib');
const { IGNORED_LAYERS } = require('../constants');
const { isImportFromPublicApi } = require('./is-import-from-public-api');
const errorsLib = require('./errors-lib');

module.exports.validateAndReport = function (node, context) {
  if (!canValidate(node)) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);

  const isIgnoredLayer = IGNORED_LAYERS.has(pathsInfo.importLayer);

  if (pathsInfo.isUnknownLayer || isIgnoredLayer) {
    return;
  }

  if (isImportFromPublicApi(pathsInfo)) {
    return;
  }

  errorsLib.reportShouldBeFromPublicApi(node, context, pathsInfo);
};
