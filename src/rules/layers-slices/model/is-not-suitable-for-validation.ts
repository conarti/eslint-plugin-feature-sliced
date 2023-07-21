import { type PathsInfo } from '../../../lib/feature-sliced';

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

  return false;
}
