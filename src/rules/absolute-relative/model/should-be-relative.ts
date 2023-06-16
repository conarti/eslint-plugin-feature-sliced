import {
  type PathsInfo,
} from '../../../lib/fsd-lib';

/* TODO refactor this */
export function shouldBeRelative(pathsInfo: PathsInfo): boolean {
  const {
    isRelative,
    isInsideShared,
    isInsideApp,
    isSameLayer,
    isSameSlice,
    hasNotLayer,
    hasNotSlice,
    hasNotCurrentFileLayer,
    hasNotCurrentFileSlice,
  } = pathsInfo;

  if (isRelative) {
    return false;
  }

  if (hasNotLayer || hasNotSlice) {
    return false;
  }

  if (hasNotCurrentFileLayer && hasNotCurrentFileSlice) {
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
