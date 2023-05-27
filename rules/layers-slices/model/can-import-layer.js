const {
  getLayerWeight,
  isLayer,
} = require('../../../lib/fsd-lib');

function isPathsIncorrectForValidate(pathsInfo) {
  const {
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  const isImportToNotFsdEntity = !currentFileSlice; /* TODO: move to 'extractPathsInfo' */
  const isImportFromSameSlice = importSlice === currentFileSlice; /* TODO: move to 'extractPathsInfo' */
  const hasUnknownLayers = !isLayer(importLayer) || !isLayer(currentFileLayer); /* TODO: move to 'extractPathsInfo' */

  return isImportToNotFsdEntity // FIXME: is it needed here? removing this won't break any test
    || isImportFromSameSlice
    || hasUnknownLayers;
}

module.exports.canImportLayer = function (pathsInfo, ruleOptions) {
  const {
    isType,
    importLayer,
    currentFileLayer,
  } = pathsInfo;
  const { allowTypeImports = false } = ruleOptions;

  const isTypeAndAllowedToImport = allowTypeImports && isType;

  const isInsideShared = importLayer === 'shared' && currentFileLayer === 'shared';
  const isInsideApp = importLayer === 'app' && currentFileLayer === 'app';

  const importLayerOrder = getLayerWeight(importLayer);
  const currentFileLayerOrder = getLayerWeight(currentFileLayer);
  const isImportLayerBelowCurrent = currentFileLayerOrder > importLayerOrder;

  return isPathsIncorrectForValidate(pathsInfo)
    || isTypeAndAllowedToImport
    || isInsideShared
    || isInsideApp
    || isImportLayerBelowCurrent;
};
