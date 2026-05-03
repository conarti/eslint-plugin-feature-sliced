import type { PathsInfo } from '../../../lib/feature-sliced';
import { isPathRelative } from '../../../lib/path';

/**
 * For a relative import, treats current and target as the same slice
 * when both paths share the layer and the first folder after it.
 *
 * Per FSD, a slice is the first folder under its layer. Relative imports
 * are scoped within a slice by convention, so this path-based comparison
 * is reliable even when a slice has subfolders that don't match a known
 * FSD-segment (the heuristic-based slice extractor can pick a wrong leaf
 * in that case, producing false positives like "features into features").
 */
function isRelativeImportWithinSameSliceScope(pathsInfo: PathsInfo): boolean {
  if (!isPathRelative(pathsInfo.normalizedTargetPath)) {
    return false;
  }

  const currentLayer = pathsInfo.fsdPartsOfCurrentFile.layer;
  const targetLayer = pathsInfo.fsdPartsOfTarget.layer;
  if (!currentLayer || currentLayer !== targetLayer) {
    return false;
  }

  const currentParts = pathsInfo.normalizedCurrentFilePath.split('/').filter(Boolean);
  const targetParts = pathsInfo.absoluteTargetPath.split('/').filter(Boolean);

  const layerLc = currentLayer.toLowerCase();
  const currentLayerIdx = currentParts.findIndex((part) => part.toLowerCase() === layerLc);
  const targetLayerIdx = targetParts.findIndex((part) => part.toLowerCase() === layerLc);
  if (currentLayerIdx === -1 || targetLayerIdx === -1) {
    return false;
  }

  const currentSliceFolder = currentParts[currentLayerIdx + 1];
  const targetSliceFolder = targetParts[targetLayerIdx + 1];
  if (!currentSliceFolder || !targetSliceFolder) {
    return false;
  }

  return currentSliceFolder === targetSliceFolder;
}

export function isNotSuitableForValidation(pathsInfo: PathsInfo) {
  const {
    isSameSlice,
    isSameLayerWithoutSlices,
    hasUnknownLayers,
  } = pathsInfo;

  if (hasUnknownLayers) {
    return true;
  }

  if (isSameSlice) {
    return true;
  }

  if (isSameLayerWithoutSlices) {
    return true;
  }

  if (isRelativeImportWithinSameSliceScope(pathsInfo)) {
    return true;
  }

  return false;
}
