import { extractPathsInfo } from '../../../lib/feature-sliced';
import { type ImportExportNodesWithSourceValue } from '../../../lib/rule';
import { layers, segments } from '../../../config';
import { type RuleContext } from '../config';
import { isNull } from '../../../lib/shared';

function hasCrossImportPath(normalizedTargetPath: string): boolean {
  return normalizedTargetPath.split('/').includes('@x');
}

function extractPotentialSegment(normalizedTargetPath: string): string | null {
  const parts = normalizedTargetPath.split('/').filter(Boolean);
  const layerNames = layers as readonly string[];
  const segmentNames = segments as readonly string[];

  const layerIndex = parts.findIndex((part) => layerNames.includes(part.toLowerCase()));
  if (layerIndex === -1) {
    return null;
  }

  const firstPartAfterLayerIndex = layerIndex + 1;
  if (!parts[firstPartAfterLayerIndex]) {
    return null;
  }

  const knownSegmentIndex = parts.findIndex((part, index) => index > firstPartAfterLayerIndex && segmentNames.includes(part.toLowerCase()));
  if (knownSegmentIndex !== -1) {
    return parts[knownSegmentIndex];
  }

  return parts[firstPartAfterLayerIndex + 1] ?? null;
}

export function isUnknownSegment(node: ImportExportNodesWithSourceValue, context: RuleContext): boolean {
  const pathsInfo = extractPathsInfo(node, context);

  if (hasCrossImportPath(pathsInfo.normalizedTargetPath)) {
    return false;
  }

  const potentialSegment = extractPotentialSegment(pathsInfo.normalizedTargetPath);

  if (isNull(potentialSegment)) {
    return false;
  }

  return !(segments as readonly string[]).includes(potentialSegment);
}
