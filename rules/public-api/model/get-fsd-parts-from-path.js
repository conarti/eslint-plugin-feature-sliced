const { segmentsElementsRegExp } = require('../constants');

module.exports.getFsdPartsFromPath = (targetPath) => {
  const segmentsRegexpMatch = targetPath.match(segmentsElementsRegExp);

  if (segmentsRegexpMatch === null) {
    return {
      layer: '',
      segment: '',
      segmentFiles: '',
    };
  }

  return {
    layer: segmentsRegexpMatch.groups.layer,
    segment: segmentsRegexpMatch.groups.segment,
    segmentFiles: segmentsRegexpMatch.groups.segmentFiles,
  };
};
