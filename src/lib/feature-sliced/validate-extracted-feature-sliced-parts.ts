import type { NormalizedLayerConfig } from '../../config';
import type { ExtractedFeatureSlicedParts } from './extract-feature-sliced-parts';
import { isNull } from '../shared';
import {
  canLayerContainSlices,
  isLayer,
} from './layers';

/**
 * Validates extracted FSD parts.
 * If config is not provided, uses default FSD layers.
 */
export function validateExtractedFeatureSlicedParts(
  extractedFeatureSlicedParts: ExtractedFeatureSlicedParts,
  config?: NormalizedLayerConfig[],
) {
  const {
    layer,
    slice,
    segment,
    segmentFiles,
  } = extractedFeatureSlicedParts;

  const hasLayer = isLayer(layer, config);
  const hasNotLayer = !hasLayer;
  const hasSlice = !isNull(slice);
  const hasNotSlice = !hasSlice;
  const hasSegment = !isNull(segment);
  const hasNotSegment = !hasSegment;
  const hasSegmentFiles = !isNull(segmentFiles);
  const hasNotSegmentFiles = !hasSegmentFiles;

  const canContainSlices = hasLayer && canLayerContainSlices(layer, config);

  return {
    hasLayer,
    hasNotLayer,
    hasSlice,
    hasNotSlice,
    hasSegment,
    hasNotSegment,
    hasSegmentFiles,
    hasNotSegmentFiles,
    canLayerContainSlices: canContainSlices,
  };
}

export type ValidatedFeatureSlicedParts = ReturnType<typeof validateExtractedFeatureSlicedParts>;
