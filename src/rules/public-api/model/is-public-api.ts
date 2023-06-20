import { type PathsInfo } from '../../../lib/fsd-lib';
import { VALIDATION_LEVEL } from '../config';
import { isIndexFile } from './is-index-file';

const validateSegments = (pathsInfo: PathsInfo) => {
  const {
    isSameSegment,
    segmentFiles,
    hasNotSegmentFiles,
  } = pathsInfo;

  const isSegmentPublicApi = hasNotSegmentFiles
    || isIndexFile(segmentFiles as string /* 'hasNotSegmentFiles' is already validate it, ts doesn't understand */);

  return isSameSegment || isSegmentPublicApi;
};

type ValidateOptions = { level: VALIDATION_LEVEL }

export function isPublicApi(pathsInfo: PathsInfo, validateOptions: ValidateOptions) {
  const { level } = validateOptions;

  const isAnotherSlice = !pathsInfo.isSameSlice;
  const isSlicePublicApi = pathsInfo.hasNotSegment;

  if (isAnotherSlice) {
    return isSlicePublicApi;
  }

  const needValidateSegments = level === VALIDATION_LEVEL.SEGMENTS;

  if (needValidateSegments) {
    return validateSegments(pathsInfo);
  }

  return true;
}
