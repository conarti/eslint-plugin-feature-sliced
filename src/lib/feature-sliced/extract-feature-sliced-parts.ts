import type { NormalizedLayerConfig } from '../../config';
import { extractLayer } from './extract-layer';
import { extractSegment } from './extract-segment';
import { extractSlice } from './extract-slice';

interface ExtractOptions {
  layersConfig?: NormalizedLayerConfig[];
  segmentsConfig?: string[];
  /**
   * The path the slice is resolved from, when it differs from the target path: an aliased
   * target has to be re-rooted under the current file's layer root before it names a real
   * directory. The layer and the segment keep reading the target path itself.
   */
  slicePath?: string;
  /** Answers whether an absolute directory holds a public api file */
  hasPublicApi?: (directory: string) => boolean;
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
  const {
    layersConfig,
    segmentsConfig,
    slicePath,
    hasPublicApi,
  } = options ?? {};

  const layer = extractLayer(targetPath, cwd, layersConfig);
  const sliceResolution = extractSlice(slicePath ?? targetPath, layersConfig, segmentsConfig, { cwd, hasPublicApi });

  /* The name list route, which is also what both sides fall back to together */
  const [fallbackSegment, fallbackSegmentFiles] = extractSegment(targetPath, layersConfig, segmentsConfig);

  const [segment, segmentFiles] = sliceResolution.resolved
    ? extractSegment(slicePath ?? targetPath, layersConfig, segmentsConfig, sliceResolution.slice)
    : [fallbackSegment, fallbackSegmentFiles];

  return {
    layer,
    slice: sliceResolution.slice,
    segment,
    segmentFiles,
    resolved: sliceResolution.resolved,
    fallback: {
      slice: sliceResolution.fallbackSlice,
      segment: fallbackSegment,
      segmentFiles: fallbackSegmentFiles,
    },
  };
}

export type ExtractedFeatureSlicedParts = ReturnType<typeof extractFeatureSlicedParts>;

/**
 * Rewrites the parts so the slice and the segment come from the path heuristic.
 *
 * The never-mix rule: a comparison between a disk resolved slice and a heuristic one compares
 * two different definitions and can err in either direction, so when either side of a
 * comparison is unresolved both sides are taken back to the heuristic. The segment travels
 * with the slice, because it is derived from the slice boundary.
 */
export function withFallbackSlice(parts: ExtractedFeatureSlicedParts): ExtractedFeatureSlicedParts {
  return {
    ...parts,
    slice: parts.fallback.slice,
    segment: parts.fallback.segment,
    segmentFiles: parts.fallback.segmentFiles,
  };
}
