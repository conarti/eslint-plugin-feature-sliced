import { type PathsInfo } from '../../../lib/fsd-lib';

/* TODO refactor this */
export function shouldBeAbsolute(pathsInfo: PathsInfo): boolean {
  const {
    isRelative,
    importLayer,
    currentFileLayer,
    hasNotLayer,
    hasNotCurrentFileLayer,
  } = pathsInfo;

  if (!isRelative) {
    return false;
  }

  if (hasNotLayer) {
    return false;
  }

  if (hasNotCurrentFileLayer) {
    return false;
  }

  return currentFileLayer !== importLayer;
}
