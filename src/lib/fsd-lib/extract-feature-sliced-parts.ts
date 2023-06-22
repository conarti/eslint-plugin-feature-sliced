import { extractLayer } from './extract-layer';
import { extractSegment } from './extract-segment';
import { extractSlice } from './extract-slice';

export function extractFeatureSlicedParts(targetPath: string, cwd?: string) {
  const layer = extractLayer(targetPath, cwd);
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
