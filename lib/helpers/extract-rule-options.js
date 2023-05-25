/**
 * Extracts object-like options passed at first options argument
 * @param context
 * @returns {{ [key: string]: any }|{}}
 */
module.exports.extractRuleOptions = (context) => context.options[0] || {};
