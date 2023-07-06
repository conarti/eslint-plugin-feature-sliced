import { type PathsInfo } from '../../../lib/feature-sliced';

export function isSlicePublicApi(pathsInfo: PathsInfo) {
  return pathsInfo.validatedFeatureSlicedPartsOfTarget.hasNotSegment;
}
