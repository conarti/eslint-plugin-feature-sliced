const {
  normalizePath,
  getLayerSliceFromPath,
  isPathRelative,
} = require('../../../lib/helpers');

module.exports.extractPathsInfo = function (node, context) {
  const importPath = normalizePath(node.source.value);
  const currentFilePath = normalizePath(context.getFilename());

  const [targetLayer, targetSlice] = getLayerSliceFromPath(importPath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(currentFilePath);
  const isImportRelative = isPathRelative(importPath);

  return {
    isImportRelative,
    targetLayer,
    targetSlice,
    currentFilePath,
    currentFileLayer,
    currentFileSlice,
  };
};
