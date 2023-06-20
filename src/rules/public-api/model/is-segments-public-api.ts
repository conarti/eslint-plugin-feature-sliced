import { type PathsInfo } from '../../../lib/fsd-lib';
import { isIndexFile } from './is-index-file';

export function isSegmentsPublicApi(pathsInfo: PathsInfo) {
  const {
    isSameSegment,
    segmentFiles,
    hasNotSegmentFiles,
  } = pathsInfo;

  const isSegmentPublicApi = hasNotSegmentFiles
    || isIndexFile(segmentFiles as string /* 'hasNotSegmentFiles' is already validate it, ts doesn't understand */);

  return isSameSegment || isSegmentPublicApi;
}
