const micromatch = require('micromatch');
const { layersMap } = require('../../../lib/constants');
const { canImportLayer } = require('./can-import-layer');

module.exports.validate = function(pathsInfo, ruleOptions){
  const {
    normalizedImportPath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
    isTypeImportKind,
  } = pathsInfo;

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

  const isImportFromSameSlice = importSlice === currentFileSlice;

  if (isImportFromSameSlice) {
    return true;
  }

  if (!layersMap.has(importLayer) || !layersMap.has(currentFileLayer)) {
    return true;
  }

  return canImportLayer(importLayer, currentFileLayer, currentFileSlice, layersMap);
};
