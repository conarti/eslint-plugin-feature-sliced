import type { NormalizedLayerConfig } from '../../../config';
import type { PathsInfo } from '../../../lib/feature-sliced';
import { isCrossImportFileTargetingOwnSlice } from '../../../lib/feature-sliced/slice-containment';

export function isNotSuitableForValidation(pathsInfo: PathsInfo, layersConfig?: NormalizedLayerConfig[]) {
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

  /*
   * An @x file is the cross-import public api of its own slice,
   * so it may reach that slice without crossing a slice boundary.
   */
  if (isCrossImportFileTargetingOwnSlice(pathsInfo.normalizedCurrentFilePath, pathsInfo.absoluteTargetPath, layersConfig)) {
    return true;
  }

  return false;
}
