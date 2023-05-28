const { VALIDATION_LEVEL } = require('../constants');

const isIndexFile = (segmentFiles) => {
  return /^index\.\w+/i.test(segmentFiles);
};

const validateSegments = (pathsInfo) => {
  const {
    isSameSegment,
    segmentFiles,
  } = pathsInfo;

  const isSegmentPublicApi = isIndexFile(segmentFiles) || segmentFiles === '';

  return isSameSegment || isSegmentPublicApi;
};

module.exports.isPublicApi = (pathsInfo, validateOptions = {}) => {
  const { level = VALIDATION_LEVEL.SLICES } = validateOptions;

  const isAnotherSlice = !pathsInfo.isSameSlice;
  const isSlicePublicApi = pathsInfo.segment === '';

  if (isAnotherSlice) {
    return isSlicePublicApi;
  }

  const needValidateSegments = level === VALIDATION_LEVEL.SEGMENTS;

  if (needValidateSegments) {
    return validateSegments(pathsInfo);
  }

  return true;
};
