const micromatch = require('micromatch');
const { canImportLayer } = require('./can-import-layer');

const isValidByRuleOptions = (pathsInfo, ruleOptions) => {
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

module.exports.validate = function(pathsInfo, ruleOptions){
  const {
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  if (isValidByRuleOptions(pathsInfo, ruleOptions)) {
    return true;
  }

  const isImportFromSameSlice = importSlice === currentFileSlice;

  if (isImportFromSameSlice) {
    return true;
  }

  return canImportLayer(importLayer, currentFileLayer, currentFileSlice);
};
