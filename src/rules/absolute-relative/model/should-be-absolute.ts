import { type PathsInfo } from '../../../lib/fsd-lib';
import { isPathRelative } from '../../../lib/path';

export function shouldBeAbsolute(pathsInfo: PathsInfo): boolean {
  const {
    normalizedTargetPath,
    fsdPartsOfTarget,
    fsdPartsOfCurrentFile,
    hasUnknownLayers,
  } = pathsInfo;

  const isAbsolute = !isPathRelative(normalizedTargetPath);

  if (isAbsolute) {
    return false;
  }

  if (hasUnknownLayers) {
    return false;
  }

  return fsdPartsOfCurrentFile.layer !== fsdPartsOfTarget.layer;
}
