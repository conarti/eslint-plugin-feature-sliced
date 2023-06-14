import {
  canValidate,
  extractRuleOptions,
  isIgnored,
  type ImportExportNodes,
} from '../../../lib/rule-lib';
import { extractPathsInfo } from '../../../lib/fsd-lib';
import { type RuleContext } from '../config';
import { shouldBeRelative } from './should-be-relative';
import { shouldBeAbsolute } from './should-be-absolute';
import {
  reportShouldBeRelative,
  reportShouldBeAbsolute,
} from './errors-lib';

type Options = {
  needCheckForAbsolute: boolean;
}

export function validateAndReport(node: ImportExportNodes, context: RuleContext, options: Options = { needCheckForAbsolute: true }) {
  if (!canValidate(node)) {
    return;
  }

  const userDefinedRuleOptions = extractRuleOptions(context);
  const pathsInfo = extractPathsInfo(node, context);

  if (isIgnored(pathsInfo.currentFilePath, userDefinedRuleOptions.ignoreInFilesPatterns)) {
    return;
  }

  if (shouldBeRelative(pathsInfo)) {
    reportShouldBeRelative(node, context);
  }

  if (options.needCheckForAbsolute && shouldBeAbsolute(pathsInfo)) {
    reportShouldBeAbsolute(node, context);
  }
}
