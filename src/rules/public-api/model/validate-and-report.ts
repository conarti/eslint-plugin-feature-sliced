import type { RuleContext } from '@typescript-eslint/utils/dist/ts-eslint';
import { extractPathsInfo } from '../../../lib/fsd-lib';
import type { ImportExportNodes } from '../../../lib/rule-lib';
import {
  canValidate,
  extractRuleOptions,
} from '../../../lib/rule-lib';
import type {
  MessageIds,
  Options,
} from '../config';
import { IGNORED_LAYERS } from '../config';
import { isPublicApi } from './is-public-api';
import { reportShouldBeFromPublicApi } from './errors-lib';

export function validateAndReport(node: ImportExportNodes, context: Readonly<RuleContext<MessageIds, Options>>) {
  if (!canValidate(node)) {
    return;
  }

  const ruleOptions = extractRuleOptions(context);
  const pathsInfo = extractPathsInfo(node, context);

  const isIgnoredLayer = pathsInfo.importLayer !== null && IGNORED_LAYERS.includes(pathsInfo.importLayer);

  if (pathsInfo.isUnknownLayer || isIgnoredLayer) {
    return;
  }

  if (!isPublicApi(pathsInfo, ruleOptions)) {
    reportShouldBeFromPublicApi(node, context, pathsInfo);
  }
}
