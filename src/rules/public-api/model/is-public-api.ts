import { VALIDATION_LEVEL } from '../config';
import type { PathsInfo } from '../../../lib/fsd-lib';

const isIndexFile = (segmentFiles: string) => {
  return /^index\.\w+/i.test(segmentFiles);
};

const validateSegments = (pathsInfo: PathsInfo) => {
  const {
    isSameSegment,
    segmentFiles,
  } = pathsInfo;

  const isSegmentPublicApi = isIndexFile(segmentFiles) || segmentFiles === '';

  return isSameSegment || isSegmentPublicApi;
};

type ValidateOptions = { level: VALIDATION_LEVEL }

export function isPublicApi(pathsInfo: PathsInfo, validateOptions: ValidateOptions) {
  const { level } = validateOptions;

  const isAnotherSlice = !pathsInfo.isSameSlice;
  const isSlicePublicApi = pathsInfo.segment === '';

  if (isAnotherSlice) {
    return isSlicePublicApi;
  }

  const needValidateSegments = level === VALIDATION_LEVEL.SEGMENTS;

  if (needValidateSegments) {
    return validateSegments(pathsInfo);
  }

  return true;
}
