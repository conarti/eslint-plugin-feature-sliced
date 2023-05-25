const {
  normalizePath,
  convertToAbsolute,
  getLayerSliceFromPath,
} = require('../../../lib/helpers');

module.exports.extractPathsInfo = function(node, context) {
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
