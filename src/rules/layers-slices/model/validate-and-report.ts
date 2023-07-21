import { extractPathsInfo } from '../../../lib/feature-sliced';
import {
  extractRuleOptions,
  hasPath,
  isIgnoredCurrentFile,
  isIgnoredTarget,
  type ImportExportNodes,
} from '../../../lib/rule';
import {
  type RuleContext,
  type Options,
} from '../config';
import { canImportLayer } from './can-import-layer';
import { reportCanNotImportLayer } from './errors-lib';
import { isNotSuitableForValidation } from './is-not-suitable-for-validation';

export function validateAndReport(node: ImportExportNodes, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (!hasPath(node)) {
    return;
  }

  const userDefinedRuleOptions = extractRuleOptions(optionsWithDefault);

  if (isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault)) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);

  if (isNotSuitableForValidation(pathsInfo)) {
    return;
  }

  if (!canImportLayer(pathsInfo, node, userDefinedRuleOptions)) {
    reportCanNotImportLayer(context, node, pathsInfo);
  }
}
