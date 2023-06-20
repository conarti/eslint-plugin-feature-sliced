import { type PathsInfo } from '../../../lib/fsd-lib';

export function shouldBeAbsolute(pathsInfo: PathsInfo): boolean {
  const {
    fsdPartsOfTarget,
    fsdPartsOfCurrentFile,
    isRelative,
    hasUnknownLayers,
  } = pathsInfo;

  if (!isRelative) {
    return false;
  }

  if (hasUnknownLayers) {
    return false;
  }

  return fsdPartsOfCurrentFile.layer !== fsdPartsOfTarget.layer;
}
