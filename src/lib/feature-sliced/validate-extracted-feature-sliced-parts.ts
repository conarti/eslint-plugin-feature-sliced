import { isNull } from '../shared';
import { type ExtractedFeatureSlicedParts } from './extract-feature-sliced-parts';
import {
  canLayerContainSlices,
  isLayer,
} from './layers';

export function validateExtractedFeatureSlicedParts(extractedFeatureSlicedParts: ExtractedFeatureSlicedParts) {
  const {
    layer,
    slice,
    segment,
    segmentFiles,
  } = extractedFeatureSlicedParts;

  const hasLayer = isLayer(layer);
  const hasNotLayer = !hasLayer;
  const hasSlice = !isNull(slice);
  const hasNotSlice = !hasSlice;
  const hasSegment = !isNull(segment);
  const hasNotSegment = !hasSegment;
  const hasSegmentFiles = !isNull(segmentFiles);
  const hasNotSegmentFiles = !hasSegmentFiles;

  const canContainSlices = hasLayer && canLayerContainSlices(layer);

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
