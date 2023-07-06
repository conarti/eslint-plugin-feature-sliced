import { extractPathsInfo } from '../../../lib/feature-sliced';
import {
  extractRuleOptions,
  canValidate,
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

export function validateAndReport(node: ImportExportNodes, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (!canValidate(node)) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);
  const userDefinedRuleOptions = extractRuleOptions(optionsWithDefault);

  if (isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault)) {
    return;
  }

  if (!canImportLayer(pathsInfo, node, userDefinedRuleOptions)) {
    reportCanNotImportLayer(context, node, pathsInfo);
  }
}
