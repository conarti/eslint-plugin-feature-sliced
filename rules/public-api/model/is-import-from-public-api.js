const { getFsdPartsFromPath } = require('./get-fsd-parts-from-path');

module.exports.isImportFromPublicApi = ({
  importPath,
  importSlice,
  currentFileSlice,
}) => {
  const pathFsdParts = getFsdPartsFromPath(importPath);

  if (importSlice === currentFileSlice) {
    return pathFsdParts.segmentFiles === '';
  }

  return pathFsdParts.segment === '';
};
