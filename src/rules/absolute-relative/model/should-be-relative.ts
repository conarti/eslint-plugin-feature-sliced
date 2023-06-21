import { type PathsInfo } from '../../../lib/fsd-lib';
import { isPathRelative } from '../../../lib/path-lib';

export function shouldBeRelative(pathsInfo: PathsInfo): boolean {
  const {
    validatedFeatureSlicedPartsOfCurrentFile,
    normalizedTargetPath,
    isSameLayerWithoutSlices,
    isSameLayer,
    isSameSlice,
  } = pathsInfo;

  const isRelative = isPathRelative(normalizedTargetPath);

  if (isRelative) {
    return false;
  }

  const isImportToLayerPublicApi = validatedFeatureSlicedPartsOfCurrentFile.hasNotSlice && isSameLayer;

  if (isImportToLayerPublicApi /* TODO cover condition with tests or remove */) {
    return true;
  }

  if (isSameLayerWithoutSlices) {
    return true;
  }

  const isSameLayerAndSlice = isSameLayer && isSameSlice;

  return isSameLayerAndSlice;
}
