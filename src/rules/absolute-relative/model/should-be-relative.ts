import {
  type PathsInfo,
} from '../../../lib/fsd-lib';

/* TODO refactor this */
export function shouldBeRelative(pathsInfo: PathsInfo): boolean {
  const {
    isRelative,
    isSameLayerWithoutSlices,
    isSameLayer,
    isSameSlice,
    hasNotLayer,
    hasNotSlice,
    hasNotCurrentFileSlice,
  } = pathsInfo;

  if (isRelative) {
    return false;
  }

  if (hasNotLayer || hasNotSlice) {
    return false;
  }

  if (hasNotCurrentFileSlice && isSameLayer) {
    return true;
  }

  if (isSameLayerWithoutSlices) {
    return true;
  }

  return isSameSlice && isSameLayer;
}
