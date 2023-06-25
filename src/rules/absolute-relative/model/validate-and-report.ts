import { extractPathsInfo } from '../../../lib/fsd-lib';
import {
  canValidate,
  extractRuleOptions,
  isIgnored,
  type ImportExportNodes,
} from '../../../lib/rule-lib';
import {
  type RuleContext,
  type Options,
} from '../config';
import {
  reportShouldBeRelative,
  reportShouldBeAbsolute,
} from './errors-lib';
import { shouldBeAbsolute } from './should-be-absolute';
import { shouldBeRelative } from './should-be-relative';

type ValidateOptions = {
  needCheckForAbsolute: boolean;
}

export function validateAndReport(
  node: ImportExportNodes,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  options: ValidateOptions = { needCheckForAbsolute: true },
) {
  if (!canValidate(node)) {
    return;
  }

  const userDefinedRuleOptions = extractRuleOptions(optionsWithDefault);
  const pathsInfo = extractPathsInfo(node, context);

  /* FIXME @duplicate of isIgnoreCurrentFile function in public-api rule */
  if (isIgnored(pathsInfo.normalizedCurrentFilePath, userDefinedRuleOptions.ignoreInFilesPatterns)) {
    return;
  }

  if (shouldBeRelative(pathsInfo)) {
    reportShouldBeRelative(node, context);
  }

  if (options.needCheckForAbsolute && shouldBeAbsolute(pathsInfo)) {
    reportShouldBeAbsolute(node, context);
  }
}
