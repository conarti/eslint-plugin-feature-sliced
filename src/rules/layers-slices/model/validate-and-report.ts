import { extractPathsInfo } from '../../../lib/fsd-lib';
import {
  extractRuleOptions,
  isIgnored,
  canValidate,
  type ImportExportNodes,
} from '../../../lib/rule-lib';
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

  const isIgnoredTargetPath = isIgnored(pathsInfo.targetPath, userDefinedRuleOptions.ignorePatterns);
  const isIgnoredCurrentFile = isIgnored(pathsInfo.currentFilePath, userDefinedRuleOptions.ignoreInFilesPatterns);

  if (isIgnoredTargetPath || isIgnoredCurrentFile) {
    return;
  }

  if (!canImportLayer(pathsInfo, node, userDefinedRuleOptions)) {
    reportCanNotImportLayer(context, node, pathsInfo);
  }
}
