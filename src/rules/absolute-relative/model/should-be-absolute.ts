import { type PathsInfo } from '../../../lib/fsd-lib';

export function shouldBeAbsolute(pathsInfo: PathsInfo): boolean {
  const {
    targetPathFeatureSlicedParts,
    currentFileFeatureSlicedParts,
    isRelative,
    hasUnknownLayers,
  } = pathsInfo;

  if (!isRelative) {
    return false;
  }

  if (hasUnknownLayers) {
    return false;
  }

  return currentFileFeatureSlicedParts.layer !== targetPathFeatureSlicedParts.layer;
}
