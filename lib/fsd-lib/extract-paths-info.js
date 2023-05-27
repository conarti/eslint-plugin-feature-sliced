const { normalizePath } = require('../path-lib/normalize-path');
const { convertToAbsolute } = require('../path-lib/convert-to-absolute');
const { getLayerSliceFromPath } = require('./get-layer-slice-from-path');
const { isPathRelative } = require('../path-lib/is-path-relative');
const { isLayer } = require('./layers');
const { getFsdPartsFromPath } = require('./get-fsd-parts-from-path');

/* TODO: remove 'import' prefix from all vars */
module.exports.extractPathsInfo = function (node, context) {
  const currentFilePath = context.getFilename(); /* FIXME: getFilename is deprecated */
  const importPath = node.source.value;

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedImportPath = normalizePath(importPath);

  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);
  const [importLayer, importSlice] = getLayerSliceFromPath(importAbsolutePath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);

  const isType = node.importKind === 'type' || node.exportKind === 'type';
  const isRelative = isPathRelative(normalizedImportPath);
  const isUnknownLayer = !isLayer(importLayer);
  const isSameSlice = importSlice === currentFileSlice;

  /** TODO: move getting 'segment', 'segmentFiles' logic to this func. Delete 'getFsdPartsFromPath'  */
  const {
    segment,
    segmentFiles,
  } = getFsdPartsFromPath(importAbsolutePath);
  const { segment: currentFileSegment } = getFsdPartsFromPath(currentFilePath);
  const isSameSegment = segment === currentFileSegment;

  return {
    importPath,
    importAbsolutePath,
    currentFilePath,
    normalizedImportPath,
    normalizedCurrentFilePath,
    importLayer,
    importSlice,
    segment,
    segmentFiles,
    currentFileLayer,
    currentFileSlice,
    isType,
    isRelative,
    isUnknownLayer,
    isSameSlice,
    isSameSegment,
  };
};
