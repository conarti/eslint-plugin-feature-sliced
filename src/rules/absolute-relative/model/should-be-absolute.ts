import { type PathsInfo } from '../../../lib/fsd-lib';

export function shouldBeAbsolute(pathsInfo: PathsInfo): boolean {
  const {
    isRelative,
    importLayer,
    currentFileLayer,
    hasUnknownLayers,
  } = pathsInfo;

  if (!isRelative) {
    return false;
  }

  if (hasUnknownLayers) {
    return false;
  }

  return currentFileLayer !== importLayer;
}
