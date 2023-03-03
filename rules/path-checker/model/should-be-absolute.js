module.exports.shouldBeAbsolute = ({
  isImportRelative,
  importLayer,
  currentFileLayer,
}) => {
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
