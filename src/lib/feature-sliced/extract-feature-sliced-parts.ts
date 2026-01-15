import type { NormalizedLayerConfig } from '../../config';
import { extractLayer } from './extract-layer';
import { extractSegment } from './extract-segment';
import { extractSlice } from './extract-slice';

/**
 * Extracts all FSD parts from a path.
 * If config is not provided, uses default FSD layers.
 */
export function extractFeatureSlicedParts(
  targetPath: string,
  cwd?: string,
  config?: NormalizedLayerConfig[],
) {
  const layer = extractLayer(targetPath, cwd, config);
  const slice = extractSlice(targetPath, config);
  const [segment, segmentFiles] = extractSegment(targetPath, config);

  return {
    layer,
    slice,
    segment,
    segmentFiles,
  };
}

export type ExtractedFeatureSlicedParts = ReturnType<typeof extractFeatureSlicedParts>;
