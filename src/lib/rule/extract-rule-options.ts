/**
 * Extracts object-like options passed at first options argument
 */
export function extractRuleOptions<OptionsWithDefault extends readonly unknown[]>(optionsWithDefault: OptionsWithDefault): OptionsWithDefault[0] {
  return optionsWithDefault[0];
}
