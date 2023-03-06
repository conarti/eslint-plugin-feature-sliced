module.exports.shouldBeAbsolute = ({
  isImportRelative,
  targetLayer,
  currentFileLayer,
}) => {
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
