const { layersMap } = require('../../../lib/constants');

function isPathsIncorrectForValidate(pathsInfo) {
  const {
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  const isImportToNotFsdEntity = !currentFileSlice;
  const isImportFromSameSlice = importSlice === currentFileSlice;
  const hasUnknownLayers = !layersMap.has(importLayer) || !layersMap.has(currentFileLayer);

  return isImportToNotFsdEntity // FIXME: is it needed here? removing this won't break any test
    || isImportFromSameSlice
    || hasUnknownLayers;
}

module.exports.canImportLayer = function (pathsInfo, ruleOptions) {
  const {
    isTypeImportKind,
    importLayer,
    currentFileLayer,
  } = pathsInfo;
  const { allowTypeImports = false } = ruleOptions;

  const isTypeAndAllowedToImport = allowTypeImports && isTypeImportKind;

  const isInsideShared = importLayer === 'shared' && currentFileLayer === 'shared';
  const isInsideApp = importLayer === 'app' && currentFileLayer === 'app';

  const importLayerOrder = layersMap.get(importLayer);
  const currentFileLayerOrder = layersMap.get(currentFileLayer);
  const isImportLayerBelowCurrent = currentFileLayerOrder > importLayerOrder;

  return isPathsIncorrectForValidate(pathsInfo)
    || isTypeAndAllowedToImport
    || isInsideShared
    || isInsideApp
    || isImportLayerBelowCurrent;
};
