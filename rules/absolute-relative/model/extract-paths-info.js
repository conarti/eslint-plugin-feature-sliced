const {
  normalizePath,
  getLayerSliceFromPath,
} = require('../../../lib/helpers');

module.exports.extractPathsInfo = function (node, context) {
  const currentFilePath = context.getFilename();
  const importPath = node.source.value;

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedImportPath = normalizePath(importPath);

  const [importLayer, importSlice] = getLayerSliceFromPath(normalizedImportPath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);

  return {
    currentFilePath,
    normalizedImportPath,
    normalizedCurrentFilePath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  };
};
