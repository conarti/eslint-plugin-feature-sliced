import {
  isLayer,
  type PathsInfo,
} from '../../../lib/fsd-lib';

/* TODO refactor this */
export function shouldBeRelative(pathsInfo: PathsInfo): boolean {
  const {
    isRelative,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
    isInsideShared,
    isInsideApp,
    isSameLayer,
    isSameSlice,
  } = pathsInfo;

  if (isRelative) {
    return false;
  }

  if (!isLayer(importLayer) || !importSlice) {
    return false;
  }

  if (!isLayer(currentFileLayer) && !currentFileSlice) {
    return false;
  }

  if (!currentFileSlice && importSlice && isSameLayer) {
    return true;
  }

  if (isInsideShared || isInsideApp) {
    return true;
  }

  return isSameSlice && isSameLayer;
}
