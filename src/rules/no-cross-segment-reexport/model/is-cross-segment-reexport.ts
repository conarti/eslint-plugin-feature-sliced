import type { NormalizedLayerConfig } from '../../../config';
import { segments } from '../../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from '../../../lib/feature-sliced/layers-config';

export type CrossSegmentReexportInfo =
  | { isCrossSegmentReexport: false; currentSegment: null; targetSegment: null }
  | { isCrossSegmentReexport: true; currentSegment: string; targetSegment: string };

const NOT_CROSS_SEGMENT: CrossSegmentReexportInfo = {
  isCrossSegmentReexport: false,
  currentSegment: null,
  targetSegment: null,
};

const FILE_EXT_REGEXP = /\.\w+$/;

/**
 * Known FSD segments in lowercase for matching
 */
const KNOWN_SEGMENTS = segments.map((s) => s.toLowerCase());

/**
 * Splits a path string into non-empty parts
 */
export function splitPathParts(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * Removes filename parts (parts containing a file extension) from path components
 */
export function removeFilenameParts(parts: string[]): string[] {
  return parts.filter((part) => !FILE_EXT_REGEXP.test(part));
}

/**
 * Finds the index of a layer part in the path components
 */
export function findLayerIndex(parts: string[], layersWithSlices: string[]): number {
  return parts.findIndex((part) =>
    layersWithSlices.includes(part.toLowerCase()),
  );
}

/**
 * Extracts segment and slice information from path parts after the layer.
 *
 * For standard paths like `['cluster', 'model']`:
 *   -> `{ segment: 'model', sliceParts: ['cluster'] }`
 *
 * For group folders like `['group', 'User', 'model']`:
 *   -> `{ segment: 'model', sliceParts: ['group', 'User'] }`
 *
 * For non-standard segments like `['cluster', 'i18n']`:
 *   -> `{ segment: 'i18n', sliceParts: ['cluster'] }`
 *
 * Strategy: find the first known FSD segment in the path parts.
 * If none found, treat the last directory component as the segment.
 *
 * @returns null if no valid segment/slice structure is found
 */
export function extractSegmentAndSlice(pathParts: string[]): { segment: string; sliceParts: string[] } | null {
  if (pathParts.length < 2)
    return null;

  const knownSegmentIndex = pathParts.findIndex((part) =>
    KNOWN_SEGMENTS.includes(part.toLowerCase()),
  );

  let segmentIndex: number;

  if (knownSegmentIndex > 0) {
    segmentIndex = knownSegmentIndex;
  }
  else if (knownSegmentIndex === 0) {
    /* Segment right after layer with no slice — not a valid FSD structure */
    return null;
  }
  else {
    /* No known segment found — treat the last directory component as segment */
    segmentIndex = pathParts.length - 1;
    if (segmentIndex < 1)
      return null;
  }

  const segment = pathParts[segmentIndex];
  const sliceParts = pathParts.slice(0, segmentIndex);

  if (sliceParts.length === 0)
    return null;

  return { segment, sliceParts };
}

/**
 * Checks whether the target path belongs to the same slice as the current file
 * and returns the target segment name if it differs from the current segment.
 *
 * @returns the target segment name if it's a cross-segment reference, or null otherwise
 */
export function findTargetSegmentInSameSlice(
  targetPathParts: string[],
  currentSliceParts: string[],
  currentSegment: string,
): string | null {
  if (targetPathParts.length === 0)
    return null;

  /* Target must have at least as many parts as the slice prefix */
  if (currentSliceParts.length > targetPathParts.length)
    return null;

  const targetHasSameSlice = currentSliceParts.every(
    (part, i) => part.toLowerCase() === targetPathParts[i]?.toLowerCase(),
  );

  if (!targetHasSameSlice)
    return null;

  /* Get target segment — what comes after the slice prefix */
  const targetSegmentCandidate = targetPathParts[currentSliceParts.length];

  if (!targetSegmentCandidate)
    return null;

  /* If target segment differs from current segment -> cross-segment reference */
  if (targetSegmentCandidate.toLowerCase() !== currentSegment.toLowerCase()) {
    return targetSegmentCandidate;
  }

  return null;
}

/**
 * Detects whether a re-export crosses segment boundaries within the same slice.
 * Uses a path-based approach to support both standard and non-standard segments.
 */
export function isCrossSegmentReexport(
  normalizedCurrentFilePath: string,
  absoluteTargetPath: string,
  config?: NormalizedLayerConfig[],
): CrossSegmentReexportInfo {
  const layersConfig = config ?? normalizeLayersConfig();
  const layersWithSlices = getLayersWithSlices(layersConfig).map((l) => l.toLowerCase());

  const currentParts = splitPathParts(normalizedCurrentFilePath);
  const targetParts = splitPathParts(absoluteTargetPath);

  /* Find layer index in current file path */
  const currentLayerIndex = findLayerIndex(currentParts, layersWithSlices);

  if (currentLayerIndex === -1)
    return NOT_CROSS_SEGMENT;

  /* Get directory parts after layer for current file */
  const currentAfterLayer = currentParts.slice(currentLayerIndex + 1);
  const currentPathParts = removeFilenameParts(currentAfterLayer);

  /* Extract segment and slice from current file */
  const currentInfo = extractSegmentAndSlice(currentPathParts);

  if (!currentInfo)
    return NOT_CROSS_SEGMENT;

  /* Find layer index in target path */
  const targetLayerIndex = findLayerIndex(targetParts, layersWithSlices);

  if (targetLayerIndex === -1)
    return NOT_CROSS_SEGMENT;

  /* Must be same layer */
  if (currentParts[currentLayerIndex].toLowerCase() !== targetParts[targetLayerIndex].toLowerCase()) {
    return NOT_CROSS_SEGMENT;
  }

  /* Get directory parts after layer for target path */
  const targetAfterLayer = targetParts.slice(targetLayerIndex + 1);
  const targetPathParts = removeFilenameParts(targetAfterLayer);

  /* Check if target is in same slice but different segment */
  const targetSegment = findTargetSegmentInSameSlice(
    targetPathParts,
    currentInfo.sliceParts,
    currentInfo.segment,
  );

  if (!targetSegment)
    return NOT_CROSS_SEGMENT;

  return {
    isCrossSegmentReexport: true,
    currentSegment: currentInfo.segment,
    targetSegment,
  };
}
