const { VALIDATION_LEVEL } = require('../constants');

const isIndexFile = (segmentFiles) => {
  return /^index\.\w+/i.test(segmentFiles);
};

const validateSegments = (pathsInfo) => {
  const {
    isSameSegment,
    segmentFiles,
  } = pathsInfo;

  if (isSameSegment) {
    return true;
  }

  return isIndexFile(segmentFiles) || segmentFiles === '';
};

module.exports.isPublicApi = (pathsInfo, validateOptions = {}) => {
  const {
    segment,
    isSameSlice,
  } = pathsInfo;

  const { level = VALIDATION_LEVEL.SLICES } = validateOptions;

  if (!isSameSlice) {
    return segment === '';
  }

  const needValidateSegments = level === VALIDATION_LEVEL.SEGMENTS;

  if (needValidateSegments) {
    return validateSegments(pathsInfo);
  }

  return true;
};
