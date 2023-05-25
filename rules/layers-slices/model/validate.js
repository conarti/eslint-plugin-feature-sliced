const micromatch = require('micromatch');
const { canImportLayer } = require('./can-import-layer');

const isValidByRuleOptions = ({
  isTypeImportKind,
  normalizedImportPath,
}, ruleOptions) => {
  const {
    allowTypeImports = false,
    ignorePatterns = null,
  } = ruleOptions;

  if (allowTypeImports && isTypeImportKind) {
    return true;
  }

  if (ignorePatterns && micromatch.isMatch(normalizedImportPath, ignorePatterns)) {
    return true;
  }

  return false;
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
