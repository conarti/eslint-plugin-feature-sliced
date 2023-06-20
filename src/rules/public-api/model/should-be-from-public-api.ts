import { type PathsInfo } from '../../../lib/fsd-lib';
import { VALIDATION_LEVEL } from '../config';
import { isSegmentsPublicApi } from './is-segments-public-api';
import { isSlicePublicApi } from './is-slice-public-api';

type ValidateOptions = { level: VALIDATION_LEVEL }

function shouldBeFromSlicePublicApi(pathsInfo: PathsInfo) {
  const isFromAnotherSlice = !pathsInfo.isSameSlice;
  return isFromAnotherSlice && !isSlicePublicApi(pathsInfo);
}

function shouldBeFromSegmentsPublicApi(pathsInfo: PathsInfo, validateOptions: ValidateOptions) {
  const needValidateSegments = validateOptions.level === VALIDATION_LEVEL.SEGMENTS;
  return needValidateSegments && !isSegmentsPublicApi(pathsInfo);
}

export function shouldBeFromPublicApi(pathsInfo: PathsInfo, validateOptions: ValidateOptions): boolean {
  return shouldBeFromSlicePublicApi(pathsInfo) || shouldBeFromSegmentsPublicApi(pathsInfo, validateOptions);
}
