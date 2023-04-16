module.exports.convertToPublicApi = ({
  targetPath,
  isImportFromSameSlice,
  segmentFiles,
  segment,
}) => {

  const publicApiPath = targetPath.replace(
    /** @duplicate части пути для удаления */
    isImportFromSameSlice ?
      `/${segmentFiles}`
      : `/${segment}${segmentFiles ? `/${segmentFiles}` : ''}`,
    '',
  );

  return publicApiPath;
};
