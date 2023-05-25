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

  // TODO: Эта логика касается slice или слоев? проверить тесты и use case оттуда, выделить в функцию логику слайсов
  const isImportFromSameSlice = importSlice === currentFileSlice;

  if (isImportFromSameSlice) {
    return true;
  }

  return canImportLayer(importLayer, currentFileLayer, currentFileSlice);
};
