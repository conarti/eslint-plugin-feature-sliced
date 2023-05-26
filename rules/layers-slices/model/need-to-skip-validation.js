const micromatch = require('micromatch');

module.exports.needToSkipValidation = function (pathsInfo, ruleOptions) {
  const { importPath } = pathsInfo;
  const { ignorePatterns = null } = ruleOptions;

  const dueIgnorePatterns = ignorePatterns && micromatch.isMatch(importPath, ignorePatterns);

  return dueIgnorePatterns;
};
