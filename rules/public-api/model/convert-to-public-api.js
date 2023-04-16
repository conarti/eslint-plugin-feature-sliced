module.exports.convertToPublicApi = ({
  targetPath,
  isImportFromSameSlice,
  segmentFiles,
  segment,
}) => {

  const valueToRemove = isImportFromSameSlice
    ? segmentFiles
    : `${segment}${segmentFiles ? `/${segmentFiles}` : ''}`;

  const publicApiPath = targetPath.replace(`/${valueToRemove}`, '');

  return [publicApiPath, valueToRemove];
};
