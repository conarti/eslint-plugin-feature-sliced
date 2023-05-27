const {
  getFsdPartsFromPath,
  extractPathsInfo,
} = require('../../../lib/fsd-lib');
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

  /** TODO: move getting 'segment', 'segmentFiles' and 'isSameSegment' logic to 'extractPathsInfo'. Delete this func  */
  const importPathFsdParts = getFsdPartsFromPath(pathsInfo.importAbsolutePath);
  const currentFilePathFsdParts = getFsdPartsFromPath(pathsInfo.currentFilePath);
  const isImportFromSameSegment = importPathFsdParts.segment === currentFilePathFsdParts.segment;

  if (isImportFromPublicApi({
    segmentFiles: importPathFsdParts.segmentFiles,
    segment: importPathFsdParts.segment,
    isImportFromSameSlice: pathsInfo.isSameSlice,
    isImportFromSameSegment,
  })) {
    return;
  }

  const pathsInfo1 = {
    normalizedImportPath: pathsInfo.normalizedImportPath,
    importPathFsdParts,
    isImportFromSameSlice: pathsInfo.isSameSlice,
  };

  errorsLib.reportShouldBeFromPublicApi(node, context, pathsInfo1);
};
