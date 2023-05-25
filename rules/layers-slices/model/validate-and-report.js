const {
  convertToAbsolute,
  getLayerSliceFromPath,
  normalizePath,
} = require('../../../lib/helpers');
const micromatch = require('micromatch');
const { layersMap } = require('../../../lib/constants');
const { ERROR_MESSAGE_ID } = require('../constants');
const { canImportLayer } = require('./can-import-layer');

const isTypeImport = (node) => {
  return node.importKind === 'type';
};

const extractPathsInfo = (node, context) => {
  const normalizedCurrentFilePath = normalizePath(context.getFilename());
  const normalizedImportPath = normalizePath(node.source.value);
  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);
  const [importLayer, importSlice] = getLayerSliceFromPath(importAbsolutePath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);

  return {
    normalizedImportPath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  };
};

module.exports.validateAndReport = function(node, context, ruleOptions) {
  const {
    allowTypeImports = false,
    ignorePatterns = null,
  } = ruleOptions;

  const {
    normalizedImportPath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = extractPathsInfo(node, context);

  if (allowTypeImports && isTypeImport(node)) {
    return;
  }

  if (ignorePatterns && micromatch.isMatch(normalizedImportPath, ignorePatterns)) {
    return;
  }

  const isImportFromSameSlice = importSlice === currentFileSlice;

  if (isImportFromSameSlice) {
    return;
  }

  if (!layersMap.has(importLayer) || !layersMap.has(currentFileLayer)) {
    return;
  }

  if (canImportLayer(importLayer, currentFileLayer, currentFileSlice, layersMap)) {
    return;
  }

  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer,
      currentFileLayer,
    },
  });
};
