const {
  normalizePath,
  convertToAbsolute,
} = require('../../../lib/path-lib');
const {
  getLayerSliceFromPath,
  isLayer,
  getFsdPartsFromPath,
} = require('../../../lib/fsd-lib');
const { getSourceRangeWithoutQuotes } = require('../../../lib/rule-lib');
const {
  IGNORED_LAYERS,
  MESSAGE_ID,
} = require('../constants');
const { convertToPublicApi } = require('./convert-to-public-api');
const { isImportFromPublicApi } = require('./is-import-from-public-api');

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

  const [fixedPath, valueToRemove] = convertToPublicApi({
    targetPath: normalizedImportPath,
    segment: importPathFsdParts.segment,
    segmentFiles: importPathFsdParts.segmentFiles,
    isImportFromSameSlice,
  });

  context.report({
    node: node.source,
    messageId: MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
    data: {
      fixedPath,
    },
    suggest: [
      {
        messageId: MESSAGE_ID.REMOVE_SUGGESTION,
        data: {
          valueToRemove,
        },
        fix: (fixer) => fixer.replaceTextRange(getSourceRangeWithoutQuotes(node.source.range), fixedPath),
      },
    ],
  });
};
