const { canImportLayer } = require('./can-import-layer');
const { isValidByRuleOptions } = require('./is-valid-by-rule-options');

module.exports.validate = function(pathsInfo, ruleOptions){
  return isValidByRuleOptions(pathsInfo, ruleOptions) || canImportLayer(pathsInfo);
};
