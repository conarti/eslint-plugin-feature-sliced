import {
  canValidate,
  extractRuleOptions,
  isIgnored,
} from '../../../lib/rule-lib';
import { extractPathsInfo } from '../../../lib/fsd-lib';
import type { Options } from '../config';
import { shouldBeRelative } from './should-be-relative';
import { shouldBeAbsolute } from './should-be-absolute';
import {
  reportShouldBeRelative,
  reportShouldBeAbsolute,
} from './errors-lib';

export function validateAndReport(node, context, options = { needCheckForAbsolute: true }) {
  if (!canValidate(node)) {
    return;
  }

  const userDefinedRuleOptions = extractRuleOptions<Options>(context);
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
