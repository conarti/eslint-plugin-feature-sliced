const micromatch = require('micromatch');

module.exports.isValidByRuleOptions = function (pathsInfo, ruleOptions) {
  const {
    isTypeImportKind,
    normalizedImportPath,
  } = pathsInfo;

  const {
    allowTypeImports = false,
    ignorePatterns = null,
  } = ruleOptions;

  const byAllowTypeImports = allowTypeImports && isTypeImportKind;
  const byIgnorePatterns = ignorePatterns && micromatch.isMatch(normalizedImportPath, ignorePatterns);

  return byAllowTypeImports || byIgnorePatterns;
};
