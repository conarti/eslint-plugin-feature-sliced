import { extractPathsInfo } from '../../../lib/fsd-lib';
import {
  canValidate,
  extractRuleOptions,
  isIgnored,
  type ImportExportNodes,
} from '../../../lib/rule-lib';
import {
  type Options,
  type RuleContext,
} from '../config';
import {
  reportLayersPublicApiNotAllowed,
  reportShouldBeFromPublicApi,
} from './errors-lib';
import { isLayerPublicApi } from './is-layer-public-api';
import { shouldBeFromPublicApi } from './should-be-from-public-api';

export function validateAndReport(node: ImportExportNodes, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (!canValidate(node)) {
    return;
  }

  const ruleOptions = extractRuleOptions(optionsWithDefault);
  const pathsInfo = extractPathsInfo(node, context);

  const isIgnoredCurrentFile = isIgnored(pathsInfo.normalizedCurrentFilePath, ruleOptions.ignoreInFilesPatterns);

  if (isIgnoredCurrentFile) {
    return;
  }

  if (shouldBeFromPublicApi(pathsInfo, ruleOptions)) {
    reportShouldBeFromPublicApi(node, context, pathsInfo);
  }

  if (isLayerPublicApi(pathsInfo)) {
    reportLayersPublicApiNotAllowed(node, context);
  }
}
