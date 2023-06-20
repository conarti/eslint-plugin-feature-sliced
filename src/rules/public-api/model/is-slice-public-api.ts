import { type PathsInfo } from '../../../lib/fsd-lib';

export function isSlicePublicApi(pathsInfo: PathsInfo) {
  return pathsInfo.validatedFeatureSlicedPartsOfTarget.hasNotSegment;
}
