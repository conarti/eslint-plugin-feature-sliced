import {
  isLayer,
  type PathsInfo,
} from '../../../lib/fsd-lib';

/* TODO refactor this */
export function shouldBeAbsolute(pathsInfo: PathsInfo): boolean {
  const {
    isRelative,
    importLayer,
    currentFileLayer,
  } = pathsInfo;

  if (!isRelative) {
    return false;
  }

  if (!isLayer(importLayer)) {
    return false;
  }

  if (!isLayer(currentFileLayer)) {
    return false;
  }

  return currentFileLayer !== importLayer;
}
