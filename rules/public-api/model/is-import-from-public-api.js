module.exports.isImportFromPublicApi = ({
  segmentFiles,
  segment,
  isImportFromSameSlice,
}) => {
  if (isImportFromSameSlice) {
    return segmentFiles === '';
  }

  return segment === '';
};
