const {
  normalizePath,
  getLayerSliceFromPath,
} = require('../../../lib/helpers');

module.exports.extractPathsInfo = function (node, context) {
  const currentFilePath = context.getFilename();
  const importPath = node.source.value;

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedImportPath = normalizePath(importPath);

  const [targetLayer, targetSlice] = getLayerSliceFromPath(normalizedImportPath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);

  return {
    currentFilePath,
    normalizedImportPath,
    normalizedCurrentFilePath,
    targetLayer,
    targetSlice,
    currentFileLayer,
    currentFileSlice,
  };
};
