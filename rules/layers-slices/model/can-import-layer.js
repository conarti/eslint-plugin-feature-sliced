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

  return isImportToNotFsdEntity
    || isImportFromSameSlice
    || hasUnknownLayers;
}

module.exports.canImportLayer = function (pathsInfo) {
  const {
    importLayer,
    currentFileLayer,
  } = pathsInfo;

  const isInsideShared = importLayer === 'shared' && currentFileLayer === 'shared';
  const isInsideApp = importLayer === 'app' && currentFileLayer === 'app';

  const importLayerOrder = layersMap.get(importLayer);
  const currentFileLayerOrder = layersMap.get(currentFileLayer);
  const isImportLayerBelowCurrent = currentFileLayerOrder > importLayerOrder;

  return isPathsIncorrectForValidate(pathsInfo)
    || isInsideShared
    || isInsideApp
    || isImportLayerBelowCurrent;
};
