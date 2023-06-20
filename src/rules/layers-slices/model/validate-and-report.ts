import { extractPathsInfo } from '../../../lib/fsd-lib';
import {
  extractRuleOptions,
  isIgnored,
  canValidate,
  type ImportExportNodes,
} from '../../../lib/rule-lib';
import { type RuleContext } from '../config';
import { canImportLayer } from './can-import-layer';
import { reportCanNotImportLayer } from './errors-lib';

export function validateAndReport(node: ImportExportNodes, context: RuleContext) {
  if (!canValidate(node)) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);
  const userDefinedRuleOptions = extractRuleOptions(context);

  const isIgnoredTargetPath = isIgnored(pathsInfo.importPath, userDefinedRuleOptions.ignorePatterns);
  const isIgnoredCurrentFile = isIgnored(pathsInfo.currentFilePath, userDefinedRuleOptions.ignoreInFilesPatterns);

  if (isIgnoredTargetPath || isIgnoredCurrentFile) {
    return;
  }

  if (!canImportLayer(pathsInfo, userDefinedRuleOptions)) {
    reportCanNotImportLayer(context, node, pathsInfo);
  }
}
