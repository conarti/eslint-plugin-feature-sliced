import { type PathsInfo } from '../../../lib/feature-sliced';
import { isIndexFile } from './is-index-file';

export function isSegmentsPublicApi(pathsInfo: PathsInfo) {
  const {
    fsdPartsOfTarget,
    validatedFeatureSlicedPartsOfTarget,
    isSameSegment,
  } = pathsInfo;

  const isSegmentPublicApi = validatedFeatureSlicedPartsOfTarget.hasNotSegmentFiles
    || isIndexFile(fsdPartsOfTarget.segmentFiles as string /* 'hasNotSegmentFiles' is already validate it, ts doesn't understand */);

  return isSameSegment || isSegmentPublicApi;
}
