const { layersMap } = require('../../../lib/constants');

function isPathsInvalidForValidate(pathsInfo) {
  const {
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  const isImportFromSameSlice = importSlice === currentFileSlice;

  const hasUnknownLayers = !layersMap.has(importLayer) || !layersMap.has(currentFileLayer);

  return !currentFileSlice
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

  return isPathsInvalidForValidate(pathsInfo)
    || isInsideShared
    || isInsideApp
    || currentFileLayerOrder > importLayerOrder;
};
