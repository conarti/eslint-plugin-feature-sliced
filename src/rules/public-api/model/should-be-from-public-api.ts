import { type PathsInfo } from '../../../lib/fsd-lib';
import { VALIDATION_LEVEL } from '../config';
import { isSegmentsPublicApi } from './is-segments-public-api';
import { isSlicePublicApi } from './is-slice-public-api';

type ValidateOptions = { level: VALIDATION_LEVEL }

export function shouldBeFromPublicApi(pathsInfo: PathsInfo, validateOptions: ValidateOptions): boolean {
  const isFromAnotherSlice = !pathsInfo.isSameSlice;
  const shouldBeFromSlicePublicApi = isFromAnotherSlice && !isSlicePublicApi(pathsInfo);

  const needValidateSegments = validateOptions.level === VALIDATION_LEVEL.SEGMENTS;
  const shouldBeFromSegmentsPublicApi = needValidateSegments && !isSegmentsPublicApi(pathsInfo);

  return shouldBeFromSlicePublicApi || shouldBeFromSegmentsPublicApi;
}
