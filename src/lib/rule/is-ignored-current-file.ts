import type { UnknownRuleContext } from './models';
import { extractCurrentFilePath } from './extract-current-file-path';
import { extractRuleOptions } from './extract-rule-options';
import { isIgnored } from './is-ignored';

type OptionsWithIgnoreFiles = Readonly<[{ ignoreFiles: string[] }]>;

export function isIgnoredCurrentFile<T extends OptionsWithIgnoreFiles>(context: UnknownRuleContext, optionsWithDefault: T) {
  const ruleOptions = extractRuleOptions(optionsWithDefault);
  const normalizedCurrentFilePath = extractCurrentFilePath(context);

  return isIgnored(normalizedCurrentFilePath, ruleOptions.ignoreFiles);
}
