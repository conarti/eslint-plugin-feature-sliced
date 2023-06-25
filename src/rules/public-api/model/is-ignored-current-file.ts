import {
  extractCurrentFilePath,
  extractRuleOptions,
  isIgnored,
  type UnknownRuleContext,
} from '../../../lib/rule-lib';

export function isIgnoredCurrentFile<
  OptionsWithPatterns extends Readonly<[{ ignoreInFilesPatterns?: string[] }]>
>(context: UnknownRuleContext, optionsWithDefault: OptionsWithPatterns) {
  const ruleOptions = extractRuleOptions(optionsWithDefault);
  const normalizedCurrentFilePath = extractCurrentFilePath(context);

  return isIgnored(normalizedCurrentFilePath, ruleOptions.ignoreInFilesPatterns);
}
