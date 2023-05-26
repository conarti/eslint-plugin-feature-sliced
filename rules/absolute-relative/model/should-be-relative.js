const { isPathRelative } = require('../../../lib/helpers');

module.exports.shouldBeRelative = (pathsInfo) => {
  const {
    normalizedImportPath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  const isImportRelative = isPathRelative(normalizedImportPath);

  if (isImportRelative) {
    return false;
  }

  if (!importLayer || !importSlice) {
    return false;
  }

  if (!currentFileLayer && !currentFileSlice) {
    return false;
  }

  if (!currentFileSlice && importSlice && currentFileLayer === importLayer) {
    return true;
  }

  // FIXME: 20я строка не то же самое делает?
  if (
    currentFileLayer === 'shared' && importLayer === 'shared'
    || currentFileLayer === 'app' && importLayer === 'app'
  ) {
    return true;
  }

  return currentFileSlice === importSlice && currentFileLayer === importLayer;
};
