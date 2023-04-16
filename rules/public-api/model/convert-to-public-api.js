const { getFsdPartsFromPath } = require('./get-fsd-parts-from-path');

module.exports.convertToPublicApi = ({
  targetPath,
  isFromSameSlice,
  importPath,
}) => {
  const pathFsdParts = getFsdPartsFromPath(importPath);

  const publicApiPath = targetPath.replace(
    /** @duplicate части пути для удаления */
    isFromSameSlice ?
      `/${pathFsdParts.segmentFiles}`
      : `/${pathFsdParts.segment}${pathFsdParts.segmentFiles ? `/${pathFsdParts.segmentFiles}` : ''}`,
    '',
  );

  return publicApiPath;
};
