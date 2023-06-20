import { extractLayer } from './extract-layer';
import { extractSegment } from './extract-segment';
import { extractSlice } from './extract-slice';

export function extractFeatureSlicedParts(targetPath: string) {
  const layer = extractLayer(targetPath);
  const slice = extractSlice(targetPath);
  const [segment, segmentFiles] = extractSegment(targetPath);

  return {
    layer,
    slice,
    segment,
    segmentFiles,
  };
}

export type ExtractedFeatureSlicedParts = ReturnType<typeof extractFeatureSlicedParts>;
