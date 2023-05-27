const {
  normalizePath,
  convertToAbsolute,
} = require('../../../lib/path-lib');
const {
  getLayerSliceFromPath,
  isLayer,
  getFsdPartsFromPath,
} = require('../../../lib/fsd-lib');
const { IGNORED_LAYERS } = require('../constants');
const { isImportFromPublicApi } = require('./is-import-from-public-api');
const errorsLib = require('./errors-lib');

module.exports.validateAndReport = function (node, context) {
  if (node.source === null) {
    return;
  }

  const currentFilePath = normalizePath(context.getFilename());
  const normalizedImportPath = normalizePath(node.source.value);
  const importPath = convertToAbsolute(currentFilePath, normalizedImportPath);

  const [importLayer, importSlice] = getLayerSliceFromPath(importPath);
  const [, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

  const isImportNotFromFsdLayer = !isLayer(importLayer);
  const isImportFromIgnoredLayer = IGNORED_LAYERS.has(importLayer);

  if (isImportNotFromFsdLayer || isImportFromIgnoredLayer) {
    return;
  }

  /** @duplicate getLayerSliceFromPath - можно убрать функцию и использовать эту */
  const importPathFsdParts = getFsdPartsFromPath(importPath);
  const currentFilePathFsdParts = getFsdPartsFromPath(currentFilePath);

  const isImportFromSameSlice = importSlice === currentFileSlice;
  const isImportFromSameSegment = importPathFsdParts.segment === currentFilePathFsdParts.segment;

  if (isImportFromPublicApi({
    segmentFiles: importPathFsdParts.segmentFiles,
    segment: importPathFsdParts.segment,
    isImportFromSameSlice,
    isImportFromSameSegment,
  })) {
    return;
  }

  const pathsInfo = {
    normalizedImportPath,
    importPathFsdParts,
    isImportFromSameSlice,
  };

  errorsLib.reportShouldBeFromPublicApi(node, context, pathsInfo);
};
