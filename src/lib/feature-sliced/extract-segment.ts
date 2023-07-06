import {
  layersWithSlices,
  segments,
  type Segment,
} from '../../config';

const layersUnion = layersWithSlices.join('|');
const segmentsUnion = segments.join('|');
const fsdPartsRegExp = new RegExp(
  `(?<=(?<layer>${layersUnion}))\\/(?<slice>([\\w-]*\\/)+?)(?<segment>(${segmentsUnion})(\\.\\w+)?)(\\/(?<segmentFiles>.*))?`,
);

type SegmentFiles = string | null;

export function extractSegment(targetPath: string): [Segment | null, SegmentFiles] {
  const fsdParts = targetPath.match(fsdPartsRegExp);

  if (fsdParts === null) {
    return [null, null];
  }

  const {
    segment = null,
    segmentFiles = null,
  } = fsdParts.groups || {};

  const fileExtensionRegExp = /\.[^/.]+$/;
  const segmentWithoutFileExtension = segment?.replace(fileExtensionRegExp, '') || null;

  return [segmentWithoutFileExtension as Segment | null, segmentFiles];
}
