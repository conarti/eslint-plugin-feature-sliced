const {
  normalizePath,
  getLayerSliceFromPath,
  convertToAbsolute,
} = require('../../../lib/helpers');

/* @duplicate - the same function at 'layers-slices' */
module.exports.extractPathsInfo = function (node, context) {
  const currentFilePath = context.getFilename();
  const importPath = node.source.value;

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedImportPath = normalizePath(importPath);

  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);

  const [importLayer, importSlice] = getLayerSliceFromPath(importAbsolutePath);
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
