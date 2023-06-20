import { type PathsInfo } from '../../../lib/fsd-lib';

export function shouldBeRelative(pathsInfo: PathsInfo): boolean {
  const {
    validatedFeatureSlicedPartsOfCurrentFile,
    isRelative,
    isSameLayerWithoutSlices,
    isSameLayer,
    isSameSlice,
  } = pathsInfo;

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
