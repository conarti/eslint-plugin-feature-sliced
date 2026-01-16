import type { NormalizedLayerConfig } from '../../../config';
import { DEFAULT_SEGMENTS } from '../../../config';
import { extractPathsInfo } from '../../../lib/feature-sliced';
import { getLayersWithSlices, normalizeLayersConfig } from '../../../lib/feature-sliced/layers-config';
import { isKnownSegment } from '../../../lib/feature-sliced/segments-config';
import {
  extractRuleOptions,
  type ImportExportNodesWithSourceValue,
} from '../../../lib/rule';
import {
  type Options,
  type RuleContext,
  VALIDATION_LEVEL,
} from '../config';

/**
 * Extracts potential segment from path after slice.
 * Returns the segment name if found in path structure, null otherwise.
 */
function extractPotentialSegment(
  targetPath: string,
  layersConfig?: NormalizedLayerConfig[],
): string | null {
  const normalizedLayersConfig = layersConfig ?? normalizeLayersConfig();
  const layersWithSlices = getLayersWithSlices(normalizedLayersConfig);

  const parts = targetPath.split('/').filter(Boolean);

  const layerIndex = parts.findIndex((part) =>
    layersWithSlices.some((layer) => layer.toLowerCase() === part.toLowerCase()),
  );

  if (layerIndex === -1 || layerIndex >= parts.length - 2) {
    return null;
  }

  /* Structure: layer/slice/segment or layer/group/slice/segment */
  const partsAfterLayer = parts.slice(layerIndex + 1);

  if (partsAfterLayer.length < 2) {
    return null;
  }

  /* Find the second segment after layer (could be slice or group) */
  /* Then check the third one which should be segment */
  /* For simplicity, check if 2nd part looks like a segment */
  const potentialSegment = partsAfterLayer[1];

  /* Remove file extension if present */
  const segmentWithoutExt = potentialSegment?.replace(/\.\w+$/, '') || null;

  return segmentWithoutExt;
}

/**
 * Checks if the import path contains an unknown segment.
 * Returns the unknown segment name if found, null otherwise.
 *
 * Only checks at SEGMENTS validation level.
 */
export function isUnknownSegment(
  node: ImportExportNodesWithSourceValue,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  layersConfig?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
): string | null {
  const ruleOptions = extractRuleOptions(optionsWithDefault);

  if (ruleOptions.level !== VALIDATION_LEVEL.SEGMENTS) {
    return null;
  }

  const effectiveSegmentsConfig = segmentsConfig ?? [...DEFAULT_SEGMENTS];

  const pathsInfo = extractPathsInfo(node, context, { layersConfig, segmentsConfig: effectiveSegmentsConfig });

  /* If segment was already extracted successfully, it's known */
  if (pathsInfo.fsdPartsOfTarget.segment) {
    return null;
  }

  /* Try to extract potential segment from path */
  const potentialSegment = extractPotentialSegment(pathsInfo.normalizedTargetPath, layersConfig);

  if (!potentialSegment) {
    return null;
  }

  /* Check if it looks like a segment but isn't known */
  if (!isKnownSegment(potentialSegment, effectiveSegmentsConfig)) {
    return potentialSegment;
  }

  return null;
}
