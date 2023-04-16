const { getFsdPartsFromPath } = require('./get-fsd-parts-from-path');

module.exports.convertToPublicApi = ({
  targetPath,
  isImportFromSameSlice,
  importPath,
}) => {
  const pathFsdParts = getFsdPartsFromPath(importPath);

  const publicApiPath = targetPath.replace(
    /** @duplicate части пути для удаления */
    isImportFromSameSlice ?
      `/${pathFsdParts.segmentFiles}`
      : `/${pathFsdParts.segment}${pathFsdParts.segmentFiles ? `/${pathFsdParts.segmentFiles}` : ''}`,
    '',
  );

  return publicApiPath;
};
