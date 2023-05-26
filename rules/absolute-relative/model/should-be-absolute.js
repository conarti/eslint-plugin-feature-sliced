const { isPathRelative } = require('../../../lib/helpers');

module.exports.shouldBeAbsolute = (pathsInfo) => {
  const {
    normalizedImportPath,
    importLayer,
    currentFileLayer,
  } = pathsInfo;

  const isImportRelative = isPathRelative(normalizedImportPath);

  if (!isImportRelative) {
    return false;
  }

  if (!importLayer) {
    return false;
  }

  if (!currentFileLayer) {
    return false;
  }

  return currentFileLayer !== importLayer;
};
