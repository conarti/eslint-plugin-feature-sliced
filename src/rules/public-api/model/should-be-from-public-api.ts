import {
  extractPathsInfo,
  type PathsInfo,
} from '../../../lib/fsd-lib';
import {
  extractRuleOptions,
  type ImportExportNodesWithSourceValue,
} from '../../../lib/rule-lib';
import {
  VALIDATION_LEVEL,
  type Options,
  type RuleContext,
} from '../config';
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

export function shouldBeFromPublicApi(node: ImportExportNodesWithSourceValue, context: RuleContext, optionsWithDefault: Readonly<Options>): boolean {
  const pathsInfo = extractPathsInfo(node, context);
  const ruleOptions = extractRuleOptions(optionsWithDefault);

  return shouldBeFromSlicePublicApi(pathsInfo) || shouldBeFromSegmentsPublicApi(pathsInfo, ruleOptions);
}
