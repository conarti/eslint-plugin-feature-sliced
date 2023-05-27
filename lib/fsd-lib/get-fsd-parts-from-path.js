const {
  layers,
  segments,
} = require('../../config');

const layersUnion = layers.join('|');
const segmentsUnion = segments.join('|');
const fsdPartsRegExp = new RegExp(
  `(?<=(?<layer>${layersUnion}))\\/(?<slice>([\\w-]*\\/)+?)(?<segment>(${segmentsUnion})(\\.\\w+)?)(\\/(?<segmentFiles>.*))?`,
);

/**
 * @deprecated This module use an overly complex regular expression. It's better to complement the logic in 'getLayerSliceFromPath' (segment + segmentFiles)
 * @param targetPath
 * @returns {{segment: string, segmentFiles: string, layer: string}}
 */
module.exports.getFsdPartsFromPath = (targetPath) => {
  const fsdParts = targetPath.match(fsdPartsRegExp);

  if (fsdParts === null) {
    return {
      layer: '',
      segment: '',
      segmentFiles: '',
    };
  }
  const {
    layer = '',
    segment = '',
    segmentFiles = '',
  } = fsdParts.groups || {};

  return {
    layer,
    segment,
    segmentFiles,
  };
};
