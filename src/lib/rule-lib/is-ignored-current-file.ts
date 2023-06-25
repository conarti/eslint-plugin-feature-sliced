import { extractCurrentFilePath } from './extract-current-file-path';
import { extractRuleOptions } from './extract-rule-options';
import { isIgnored } from './is-ignored';
import { type UnknownRuleContext } from './models';

export function isIgnoredCurrentFile<
  OptionsWithPatterns extends Readonly<[{ ignoreInFilesPatterns?: string[] }]>
>(context: UnknownRuleContext, optionsWithDefault: OptionsWithPatterns) {
  const ruleOptions = extractRuleOptions(optionsWithDefault);
  const normalizedCurrentFilePath = extractCurrentFilePath(context);

  return isIgnored(normalizedCurrentFilePath, ruleOptions.ignoreInFilesPatterns);
}
