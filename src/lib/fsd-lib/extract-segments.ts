import {
  layers,
  segments,
} from '../../config';

const layersUnion = layers.join('|');
const segmentsUnion = segments.join('|');
const fsdPartsRegExp = new RegExp(
  `(?<=(?<layer>${layersUnion}))\\/(?<slice>([\\w-]*\\/)+?)(?<segment>(${segmentsUnion})(\\.\\w+)?)(\\/(?<segmentFiles>.*))?`,
);

export function extractSegments(targetPath: string) {
  const fsdParts = targetPath.match(fsdPartsRegExp);

  if (fsdParts === null) {
    return {
      segment: '',
      segmentFiles: '',
    };
  }

  const {
    segment = '',
    segmentFiles = '',
  } = fsdParts.groups || {};

  return {
    segment,
    segmentFiles,
  };
}
