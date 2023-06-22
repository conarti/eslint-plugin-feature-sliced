import {
  extractCurrentFilePath,
  extractRuleOptions,
  isIgnored,
  type UnknownRuleContext,
} from '../../../lib/rule-lib';
import { type Options } from '../config';

export function isIgnoredCurrentFile(context: UnknownRuleContext, optionsWithDefault: Readonly<Options>) {
  const ruleOptions = extractRuleOptions(optionsWithDefault);
  const { normalizedCurrentFilePath } = extractCurrentFilePath(context);

  return isIgnored(normalizedCurrentFilePath, ruleOptions.ignoreInFilesPatterns);
}
