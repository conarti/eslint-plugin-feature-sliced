const micromatch = require('micromatch');

module.exports.needToSkipValidation = function (pathsInfo, ruleOptions) {
  const { normalizedImportPath } = pathsInfo;
  const { ignorePatterns = null } = ruleOptions;

  const byIgnorePatterns = ignorePatterns && micromatch.isMatch(normalizedImportPath, ignorePatterns);

  return byIgnorePatterns;
};
