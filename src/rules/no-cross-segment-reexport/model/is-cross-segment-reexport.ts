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

const FILE_EXT_REGEXP = /\..+$/;

/**
 * Known FSD segments in lowercase for matching
 */
const KNOWN_SEGMENTS = segments.map((s) => s.toLowerCase());

/**
 * A path component after normalization, remembering whether the original
 * component was a file name rather than a directory
 */
interface DirPart {
  name: string;
  fromFile: boolean;
}

/**
 * Splits a path string into non-empty parts
 */
function splitPathParts(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * Converts path parts to directory-like components:
 * - Index files (index.ts, index.tsx, etc.) are removed entirely
 * - Other files with extensions are converted to their name without extension
 *   (e.g. `model.ts` → `model`, since segment can be a file) and marked `fromFile`
 * - Directory parts are kept as-is
 */
function normalizeToDirParts(parts: string[]): DirPart[] {
  const INDEX_FILE_REGEXP = /^index\..+$/;

  return parts.reduce<DirPart[]>((acc, part) => {
    if (INDEX_FILE_REGEXP.test(part))
      return acc;

    if (FILE_EXT_REGEXP.test(part)) {
      acc.push({ name: part.replace(FILE_EXT_REGEXP, ''), fromFile: true });
      return acc;
    }

    acc.push({ name: part, fromFile: false });
    return acc;
  }, []);
}

/**
 * Finds the index of a layer part in the path components
 */
function findLayerIndex(parts: string[], layersWithSlices: string[]): number {
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
function extractSegmentAndSlice(pathParts: DirPart[]): { segment: string; sliceParts: DirPart[] } | null {
  if (pathParts.length < 2)
    return null;

  const knownSegmentIndex = pathParts.findIndex((part) =>
    KNOWN_SEGMENTS.includes(part.name.toLowerCase()),
  );

  let segmentIndex: number;

  if (knownSegmentIndex > 0) {
    segmentIndex = knownSegmentIndex;
  }
  else if (knownSegmentIndex === 0) {
    /* Segment right after layer with no slice is not a valid FSD structure */
    return null;
  }
  else {
    /* No known segment found: treat the last directory component as segment */
    segmentIndex = pathParts.length - 1;
    if (segmentIndex < 1)
      return null;

    /* A file name is not a segment, so there is nothing to cross here */
    if (pathParts[segmentIndex].fromFile)
      return null;
  }

  const segment = pathParts[segmentIndex].name;
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
function findTargetSegmentInSameSlice(
  targetPathParts: DirPart[],
  currentSliceParts: DirPart[],
  currentSegment: string,
): string | null {
  if (targetPathParts.length === 0)
    return null;

  /* Target must have at least as many parts as the slice prefix */
  if (currentSliceParts.length > targetPathParts.length)
    return null;

  const targetHasSameSlice = currentSliceParts.every(
    (part, i) => part.name.toLowerCase() === targetPathParts[i]?.name.toLowerCase(),
  );

  if (!targetHasSameSlice)
    return null;

  /* Target segment is what comes after the slice prefix */
  const targetSegmentCandidate = targetPathParts[currentSliceParts.length];

  if (!targetSegmentCandidate)
    return null;

  /* If target segment differs from current segment -> cross-segment reference */
  if (targetSegmentCandidate.name.toLowerCase() !== currentSegment.toLowerCase()) {
    return targetSegmentCandidate.name;
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
  const currentPathParts = normalizeToDirParts(currentAfterLayer);

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
  const targetPathParts = normalizeToDirParts(targetAfterLayer);

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
