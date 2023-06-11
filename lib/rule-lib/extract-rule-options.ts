/**
 * Extracts object-like options passed at first options argument
 */
export function extractRuleOptions<T extends Record<string, unknown>>(context): T {
  return context.options[0] || {};
}
