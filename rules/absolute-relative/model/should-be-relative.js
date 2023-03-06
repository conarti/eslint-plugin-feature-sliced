module.exports.shouldBeRelative = ({
  isImportRelative,
  targetLayer,
  targetSlice,
  currentFileLayer,
  currentFileSlice,
}) => {
  if (isImportRelative) {
    return false;
  }

  if (!targetLayer || !targetSlice) {
    return false;
  }

  if (!currentFileLayer && !currentFileSlice) {
    return false;
  }

  if (!currentFileSlice && targetSlice && currentFileLayer === targetLayer) {
    return true;
  }

  if (
    currentFileLayer === 'shared' && targetLayer === 'shared'
    || currentFileLayer === 'app' && targetLayer === 'app'
  ) {
    return true;
  }

  return currentFileSlice === targetSlice && currentFileLayer === targetLayer;
};
