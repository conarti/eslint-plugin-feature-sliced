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

  if (isImportFromPublicApi({
    segment: pathsInfo.segment,
    segmentFiles: pathsInfo.segmentFiles,
    isImportFromSameSlice: pathsInfo.isSameSlice,
    isImportFromSameSegment: pathsInfo.isSameSegment,
  })) {
    return;
  }

  const pathsInfo1 = {
    segment: pathsInfo.segment,
    segmentFiles: pathsInfo.segmentFiles,
    normalizedImportPath: pathsInfo.normalizedImportPath,
    isImportFromSameSlice: pathsInfo.isSameSlice,
  };

  errorsLib.reportShouldBeFromPublicApi(node, context, pathsInfo1);
};
