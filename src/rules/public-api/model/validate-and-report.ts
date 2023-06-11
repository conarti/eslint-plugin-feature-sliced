import { extractPathsInfo } from '../../../lib/fsd-lib';
import {
  canValidate,
  extractRuleOptions,
} from '../../../lib/rule-lib';
import type { Options } from '../config';
import { IGNORED_LAYERS } from '../config';
import { isPublicApi } from './is-public-api';
import { reportShouldBeFromPublicApi } from './errors-lib';

export function validateAndReport(node, context) {
  if (!canValidate(node)) {
    return;
  }

  const ruleOptions = extractRuleOptions<Options>(context);
  const pathsInfo = extractPathsInfo(node, context);

  const isIgnoredLayer = IGNORED_LAYERS.has(pathsInfo.importLayer);

  if (pathsInfo.isUnknownLayer || isIgnoredLayer) {
    return;
  }

  if (!isPublicApi(pathsInfo, ruleOptions)) {
    reportShouldBeFromPublicApi(node, context, pathsInfo);
  }
}
