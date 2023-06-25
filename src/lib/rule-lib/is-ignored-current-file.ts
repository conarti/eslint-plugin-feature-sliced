import { extractCurrentFilePath } from './extract-current-file-path';
import { extractRuleOptions } from './extract-rule-options';
import { isIgnored } from './is-ignored';
import { type UnknownRuleContext } from './models';

type OptionsWithIgnorePatterns = Readonly<[{ ignoreInFilesPatterns?: string[] }]>

export function isIgnoredCurrentFile<T extends OptionsWithIgnorePatterns>(context: UnknownRuleContext, optionsWithDefault: T) {
  const ruleOptions = extractRuleOptions(optionsWithDefault);
  const normalizedCurrentFilePath = extractCurrentFilePath(context);

  return isIgnored(normalizedCurrentFilePath, ruleOptions.ignoreInFilesPatterns);
}
