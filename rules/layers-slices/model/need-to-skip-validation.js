const micromatch = require('micromatch');

module.exports.needToSkipValidation = function (pathsInfo, ruleOptions) {
  const { normalizedImportPath } = pathsInfo;
  const { ignorePatterns = null } = ruleOptions;

  const dueIgnorePatterns = ignorePatterns && micromatch.isMatch(normalizedImportPath, ignorePatterns);

  return dueIgnorePatterns;
};
