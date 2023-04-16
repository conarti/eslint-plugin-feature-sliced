const { getFsdPartsFromPath } = require('./get-fsd-parts-from-path');

module.exports.isImportFromPublicApi = ({
  importPath,
  isImportFromSameSlice,
}) => {
  const pathFsdParts = getFsdPartsFromPath(importPath);

  if (isImportFromSameSlice) {
    return pathFsdParts.segmentFiles === '';
  }

  return pathFsdParts.segment === '';
};
