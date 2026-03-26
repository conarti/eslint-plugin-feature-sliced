import type { NormalizedLayerConfig } from '../../config';
import { extractLayer } from './extract-layer';
import { extractSegment } from './extract-segment';
import { extractSlice } from './extract-slice';

interface ExtractOptions {
  layersConfig?: NormalizedLayerConfig[];
  segmentsConfig?: string[];
}

/**
 * Extracts all FSD parts from a path.
 * If layersConfig is not provided, uses default FSD layers.
 * If segmentsConfig is not provided, uses default FSD segments.
 */
export function extractFeatureSlicedParts(
  targetPath: string,
  cwd?: string,
  options?: ExtractOptions,
) {
  const { layersConfig, segmentsConfig } = options ?? {};

  const layer = extractLayer(targetPath, cwd, layersConfig);
  const slice = extractSlice(targetPath, layersConfig, segmentsConfig);
  const [segment, segmentFiles] = extractSegment(targetPath, layersConfig, segmentsConfig);

  return {
    layer,
    slice,
    segment,
    segmentFiles,
  };
}

export type ExtractedFeatureSlicedParts = ReturnType<typeof extractFeatureSlicedParts>;
