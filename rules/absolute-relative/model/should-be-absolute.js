const { isPathRelative } = require('../../../lib/helpers');

module.exports.shouldBeAbsolute = (pathsInfo) => {
  const {
    normalizedImportPath,
    targetLayer,
    currentFileLayer,
  } = pathsInfo;

  const isImportRelative = isPathRelative(normalizedImportPath);

  if (!isImportRelative) {
    return false;
  }

  if (!targetLayer) {
    return false;
  }

  if (!currentFileLayer) {
    return false;
  }

  return currentFileLayer !== targetLayer;
};
