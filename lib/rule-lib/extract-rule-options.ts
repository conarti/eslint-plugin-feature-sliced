/**
 * Extracts object-like options passed at first options argument
 */
export function extractRuleOptions<RuleOptions extends unknown[]>(context): RuleOptions[0] {
  return context.options[0] || {};
}
