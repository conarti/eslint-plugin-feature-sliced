import type { PathsInfo } from '../../../lib/feature-sliced';
import { isPathRelative } from '../../../lib/path';

/**
 * For a relative import, treats current and target as the same slice
 * when both paths share the layer and the first folder after it.
 *
 * This fallback is only used when the regular extractor cannot find FSD
 * segments in either path. If a segment is present, the extractor has enough
 * information to support group folders and should stay authoritative.
 */
function splitProjectPath(path: string, cwd?: string): string[] {
  if (!cwd) {
    return path.split('/').filter(Boolean);
  }

  const lowerCasedPath = path.toLowerCase();
  const lowerCasedCwd = cwd.toLowerCase();
  const pathWithinCwd = lowerCasedPath.startsWith(`${lowerCasedCwd}/`)
    ? path.slice(cwd.length + 1)
    : path;

  return pathWithinCwd.split('/').filter(Boolean);
}

function isRelativeImportWithinSameSliceScope(pathsInfo: PathsInfo): boolean {
  if (!isPathRelative(pathsInfo.normalizedTargetPath)) {
    return false;
  }

  const currentLayer = pathsInfo.fsdPartsOfCurrentFile.layer;
  const targetLayer = pathsInfo.fsdPartsOfTarget.layer;
  if (!currentLayer || currentLayer !== targetLayer) {
    return false;
  }

  if (pathsInfo.fsdPartsOfCurrentFile.segment || pathsInfo.fsdPartsOfTarget.segment) {
    return false;
  }

  const currentParts = splitProjectPath(pathsInfo.normalizedCurrentFilePath, pathsInfo.normalizedCwd);
  const targetParts = splitProjectPath(pathsInfo.absoluteTargetPath, pathsInfo.normalizedCwd);

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
