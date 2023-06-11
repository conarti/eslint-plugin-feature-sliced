const addSlashToStart = (targetPath) => targetPath ? `/${targetPath}` : '';

module.exports.convertToPublicApi = (pathsInfo) => {
  const {
    normalizedImportPath,
    isSameSlice,
    segmentFiles,
    segment,
  } = pathsInfo;

  const valueToRemove = isSameSlice
    ? segmentFiles
    : `${segment}${addSlashToStart(segmentFiles)}`;

  const publicApiPath = normalizedImportPath.replace(`/${valueToRemove}`, '');

  return [publicApiPath, valueToRemove];
};
