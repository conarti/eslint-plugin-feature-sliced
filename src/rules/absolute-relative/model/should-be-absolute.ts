import { type PathsInfo } from '../../../lib/fsd-lib';

export function shouldBeAbsolute(pathsInfo: PathsInfo): boolean {
  const {
    targetPathFeatureSlicedParts,
    isRelative,
    currentFileLayer,
    hasUnknownLayers,
  } = pathsInfo;

  if (!isRelative) {
    return false;
  }

  if (hasUnknownLayers) {
    return false;
  }

  return currentFileLayer !== targetPathFeatureSlicedParts.layer;
}
