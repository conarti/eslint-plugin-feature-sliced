import { extractNodePath } from './extract-node-path';
import { extractRuleOptions } from './extract-rule-options';
import { isIgnored } from './is-ignored';
import { type ImportExportNodesWithSourceValue } from './models';

type OptionsWithIgnorePatterns = Readonly<[{ ignorePatterns: string[] }]>

export function isIgnoredTarget<T extends OptionsWithIgnorePatterns>(node: ImportExportNodesWithSourceValue, optionsWithDefault: T) {
  const { targetPath } = extractNodePath(node);
  const userDefinedRuleOptions = extractRuleOptions(optionsWithDefault);

  return isIgnored(targetPath, userDefinedRuleOptions.ignorePatterns);
}
