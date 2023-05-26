const {
  normalizePath,
  convertToAbsolute,
  getLayerSliceFromPath,
} = require('../../../lib/helpers');

module.exports.extractPathsInfo = function (node, context) {
  const importPath = node.source.value;
  const normalizedImportPath = normalizePath(importPath);
  const normalizedCurrentFilePath = normalizePath(context.getFilename());
  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);
  const [importLayer, importSlice] = getLayerSliceFromPath(importAbsolutePath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);
  const isTypeImportKind = node.importKind === 'type';

  return {
    importPath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
    isTypeImportKind,
  };
};
