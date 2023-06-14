import type { UnknownRuleContext } from './models';

/**
 * Extracts object-like options passed at first options argument
 */
export function extractRuleOptions<RuleContext extends UnknownRuleContext>(context: RuleContext): RuleContext['options'][0] {
  return context.options[0] || {};
}
