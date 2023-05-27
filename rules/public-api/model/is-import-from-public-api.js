const isImportFromIndexFile = (segmentFiles) => {
  return /^index\.\w+/i.test(segmentFiles);
};

module.exports.isImportFromPublicApi = (pathsInfo) => {
  const {
    segmentFiles,
    segment,
    isSameSlice,
    isSameSegment,
  } = pathsInfo;

  if (!isSameSlice) {
    return segment === '';
  }

  if (isSameSegment) {
    return true;
  } else {
    return isImportFromIndexFile(segmentFiles) || segmentFiles === '';
  }
};
