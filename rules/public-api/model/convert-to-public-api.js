const addSlashToStart = (targetPath) => targetPath ? `/${targetPath}` : '';

module.exports.convertToPublicApi = ({
  targetPath,
  isImportFromSameSlice,
  segmentFiles,
  segment,
}) => {

  const valueToRemove = isImportFromSameSlice
    ? segmentFiles
    : `${segment}${addSlashToStart(segmentFiles)}`;

  const publicApiPath = targetPath.replace(`/${valueToRemove}`, '');

  return [publicApiPath, valueToRemove];
};
