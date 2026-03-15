import type { NormalizedLayerConfig } from '../../../config';
import { segments } from '../../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from '../../../lib/feature-sliced/layers-config';

export interface CrossSegmentReexportInfo {
  isCrossSegmentReexport: boolean;
  currentSegment: string | null;
  targetSegment: string | null;
}

const NOT_CROSS_SEGMENT: CrossSegmentReexportInfo = {
  isCrossSegmentReexport: false,
  currentSegment: null,
  targetSegment: null,
};

/**
 * Detects whether a re-export crosses segment boundaries within the same slice.
 * Uses a path-based approach to support both standard and non-standard segments.
 */
export function isCrossSegmentReexport(
  normalizedCurrentFilePath: string,
  absoluteTargetPath: string,
  _normalizedCwd: string | undefined,
  config?: NormalizedLayerConfig[],
): CrossSegmentReexportInfo {
  const layersConfig = config ?? normalizeLayersConfig();
  const layersWithSlices = getLayersWithSlices(layersConfig).map((l) => l.toLowerCase());

  const currentParts = normalizedCurrentFilePath.split('/').filter(Boolean);
  const targetParts = absoluteTargetPath.split('/').filter(Boolean);

  /* Find layer index in current file path */
  const currentLayerIndex = currentParts.findIndex((part) =>
    layersWithSlices.includes(part.toLowerCase()),
  );

  if (currentLayerIndex === -1)
    return NOT_CROSS_SEGMENT;

  /* Get parts after layer for current file */
  const currentAfterLayer = currentParts.slice(currentLayerIndex + 1);

  /* Need at least 2 parts after layer: slice + segment (+ optional file) */
  if (currentAfterLayer.length < 2)
    return NOT_CROSS_SEGMENT;

  /*
   * Remove filename (parts with file extension) from the path.
   * This leaves only directory components.
   */
  const fileExtRegExp = /\.\w+$/;
  const currentPathParts = currentAfterLayer.filter((part) => !fileExtRegExp.test(part));

  if (currentPathParts.length < 2)
    return NOT_CROSS_SEGMENT;

  /*
   * Determine segment position in the current path.
   *
   * For standard paths like entities/cluster/model/index.ts:
   *   pathParts = ['cluster', 'model'] -> slice='cluster', segment='model'
   *
   * For group folders like entities/group/User/model/index.ts:
   *   pathParts = ['group', 'User', 'model'] -> slice='group/User', segment='model'
   *
   * For non-standard segments like entities/cluster/i18n/index.ts:
   *   pathParts = ['cluster', 'i18n'] -> slice='cluster', segment='i18n'
   *
   * Strategy: find the first known FSD segment in the path parts.
   * If none found, treat the last directory component as the segment.
   */
  const knownSegments = segments.map((s) => s.toLowerCase());

  const knownSegmentIndex = currentPathParts.findIndex((part) =>
    knownSegments.includes(part.toLowerCase()),
  );

  let currentSegmentIndex: number;

  if (knownSegmentIndex > 0) {
    currentSegmentIndex = knownSegmentIndex;
  }
  else if (knownSegmentIndex === 0) {
    /* Segment right after layer with no slice - not a valid FSD structure */
    return NOT_CROSS_SEGMENT;
  }
  else {
    /* No known segment found - treat the last directory component as segment */
    currentSegmentIndex = currentPathParts.length - 1;
    if (currentSegmentIndex < 1)
      return NOT_CROSS_SEGMENT;
  }

  const currentSegment = currentPathParts[currentSegmentIndex];
  const currentSliceParts = currentPathParts.slice(0, currentSegmentIndex);

  if (currentSliceParts.length === 0)
    return NOT_CROSS_SEGMENT;

  /* Now check the target path */
  const targetLayerIndex = targetParts.findIndex((part) =>
    layersWithSlices.includes(part.toLowerCase()),
  );

  if (targetLayerIndex === -1)
    return NOT_CROSS_SEGMENT;

  /* Must be same layer */
  if (currentParts[currentLayerIndex].toLowerCase() !== targetParts[targetLayerIndex].toLowerCase()) {
    return NOT_CROSS_SEGMENT;
  }

  const targetAfterLayer = targetParts.slice(targetLayerIndex + 1);
  const targetPathParts = targetAfterLayer.filter((part) => !fileExtRegExp.test(part));

  if (targetPathParts.length === 0)
    return NOT_CROSS_SEGMENT;

  /* Check if target starts with the same slice prefix */
  if (currentSliceParts.length > targetPathParts.length)
    return NOT_CROSS_SEGMENT;

  const targetHasSameSlice = currentSliceParts.every(
    (part, i) => part.toLowerCase() === targetPathParts[i]?.toLowerCase(),
  );

  if (!targetHasSameSlice)
    return NOT_CROSS_SEGMENT;

  /* Get target segment - what comes after the slice prefix */
  const targetSegmentCandidate = targetPathParts[currentSliceParts.length];

  if (!targetSegmentCandidate)
    return NOT_CROSS_SEGMENT;

  /* If target segment differs from current segment -> cross-segment reexport */
  if (targetSegmentCandidate.toLowerCase() !== currentSegment.toLowerCase()) {
    return {
      isCrossSegmentReexport: true,
      currentSegment,
      targetSegment: targetSegmentCandidate,
    };
  }

  return NOT_CROSS_SEGMENT;
}
