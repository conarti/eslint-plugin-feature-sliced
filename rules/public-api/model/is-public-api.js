const { VALIDATION_LEVEL } = require('../constants');

const isIndexFile = (segmentFiles) => {
  return /^index\.\w+/i.test(segmentFiles);
};

module.exports.isPublicApi = (pathsInfo, validateOptions = {}) => {
  const {
    segmentFiles,
    segment,
    isSameSlice,
    isSameSegment,
  } = pathsInfo;

  const { level = VALIDATION_LEVEL.SLICES } = validateOptions;

  if (!isSameSlice) {
    return segment === '';
  }

  const needValidateSegments = level === VALIDATION_LEVEL.SEGMENTS;

  if (!needValidateSegments) {
    return true;
  }

  if (isSameSegment) {
    return true;
  }

  return isIndexFile(segmentFiles) || segmentFiles === '';
};
