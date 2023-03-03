module.exports.shouldBeRelative = ({
  isImportRelative,
  importLayer,
  importSlice,
  currentFileLayer,
  currentFileSlice,
}) => {
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

  if (
    currentFileLayer === 'shared' && importLayer === 'shared'
    || currentFileLayer === 'app' && importLayer === 'app'
  ) {
    return true;
  }

  return currentFileSlice === importSlice && currentFileLayer === importLayer;
};
