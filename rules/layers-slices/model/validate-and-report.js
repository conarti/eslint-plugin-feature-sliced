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

module.exports.validateAndReport = function(node, context, ruleOptions) {
  const {
    allowTypeImports = false,
    ignorePatterns = null,
  } = ruleOptions;

  if (allowTypeImports && isTypeImport(node)) {
    return;
  }

  const currentFilePath = normalizePath(context.getFilename());
  const normalizedImportPath = normalizePath(node.source.value);
  const importPath = convertToAbsolute(currentFilePath, normalizedImportPath);

  if (ignorePatterns && micromatch.isMatch(importPath, ignorePatterns)) {
    return;
  }

  const [importLayer, importSlice] = getLayerSliceFromPath(importPath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

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
