import {
  isLayer,
  type PathsInfo,
} from '../../../lib/fsd-lib';

/* TODO refactor this */
export function shouldBeRelative(pathsInfo: PathsInfo): boolean {
  const {
    isRelative,
    importLayer,
    currentFileLayer,
    isInsideShared,
    isInsideApp,
    isSameLayer,
    isSameSlice,
    hasNotSlice,
    hasNotCurrentFileSlice,
  } = pathsInfo;

  if (isRelative) {
    return false;
  }

  if (!isLayer(importLayer) || hasNotSlice) {
    return false;
  }

  if (!isLayer(currentFileLayer) && hasNotCurrentFileSlice) {
    return false;
  }

  if (hasNotCurrentFileSlice && isSameLayer) {
    return true;
  }

  if (isInsideShared || isInsideApp) {
    return true;
  }

  return isSameSlice && isSameLayer;
}
