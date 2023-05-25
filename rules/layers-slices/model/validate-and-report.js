const {
  convertToAbsolute,
  getLayerSliceFromPath,
  normalizePath,
} = require('../../../lib/helpers');
const micromatch = require('micromatch');
const { layersMap } = require('../../../lib/constants');
const { ERROR_MESSAGE_ID } = require('../constants');
const { canImportLayer } = require('./can-import-layer');

const extractPathsInfo = (node, context) => {
  const normalizedCurrentFilePath = normalizePath(context.getFilename());
  const normalizedImportPath = normalizePath(node.source.value);
  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);
  const [importLayer, importSlice] = getLayerSliceFromPath(importAbsolutePath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);
  const isTypeImportKind = node.importKind === 'type';

  return {
    normalizedImportPath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
    isTypeImportKind,
  };
};

const validate = (pathsInfo, ruleOptions) => {
  const {
    normalizedImportPath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
    isTypeImportKind,
  } = pathsInfo;

  const {
    allowTypeImports = false,
    ignorePatterns = null,
  } = ruleOptions;

  if (allowTypeImports && isTypeImportKind) {
    return true;
  }

  if (ignorePatterns && micromatch.isMatch(normalizedImportPath, ignorePatterns)) {
    return true;
  }

  const isImportFromSameSlice = importSlice === currentFileSlice;

  if (isImportFromSameSlice) {
    return true;
  }

  if (!layersMap.has(importLayer) || !layersMap.has(currentFileLayer)) {
    return true;
  }

  return canImportLayer(importLayer, currentFileLayer, currentFileSlice, layersMap);
};

module.exports.validateAndReport = function(node, context, ruleOptions) {
  const pathsInfo = extractPathsInfo(node, context);

  if (validate(pathsInfo, ruleOptions)) {
    return;
  }

  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.importLayer,
      currentFileLayer: pathsInfo.currentFileLayer,
    },
  });
};
