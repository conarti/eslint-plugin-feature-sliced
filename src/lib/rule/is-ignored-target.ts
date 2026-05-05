import type { ImportExportNodesWithSourceValue } from './models';
import { extractNodePath } from './extract-node-path';
import { extractRuleOptions } from './extract-rule-options';
import { isIgnored } from './is-ignored';

type OptionsWithIgnoreImports = Readonly<[{ ignoreImports: string[] }]>;

export function isIgnoredTarget<T extends OptionsWithIgnoreImports>(node: ImportExportNodesWithSourceValue, optionsWithDefault: T) {
  const { targetPath } = extractNodePath(node);
  const userDefinedRuleOptions = extractRuleOptions(optionsWithDefault);

  return isIgnored(targetPath, userDefinedRuleOptions.ignoreImports);
}
