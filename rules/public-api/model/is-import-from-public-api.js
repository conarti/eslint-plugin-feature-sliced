module.exports.isImportFromPublicApi = ({
  segmentFiles,
  segment,
  isImportFromSameSlice,
  isImportFromSameSegment,
}) => {
  if (!isImportFromSameSlice) {
    return segment === '';
  }

  if (isImportFromSameSegment) {
    return true;
  } else {
    return segmentFiles === '';
  }
};
