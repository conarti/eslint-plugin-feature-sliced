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

  if (!currentFileSlice && importSlice && currentFileLayer === importLayer) {
    return true;
  }

  /* TODO @duplicate of 'isInsideShared'/'isInsideApp' */
  if (
    currentFileLayer === 'shared' && importLayer === 'shared'
    || currentFileLayer === 'app' && importLayer === 'app'
  ) {
    return true;
  }

  return currentFileSlice === importSlice && currentFileLayer === importLayer;
}
