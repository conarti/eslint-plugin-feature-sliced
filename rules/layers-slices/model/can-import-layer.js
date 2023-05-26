const { layersMap } = require('../../../lib/constants');

module.exports.canImportLayer = (pathsInfo) => {
  const {
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  const isImportFromSameSlice = importSlice === currentFileSlice;

  const hasUnknownLayers = !layersMap.has(importLayer) || !layersMap.has(currentFileLayer);

  const isInsideShared = importLayer === 'shared' && currentFileLayer === 'shared';
  const isInsideApp = importLayer === 'app' && currentFileLayer === 'app';

  const importLayerOrder = layersMap.get(importLayer);
  const currentFileLayerOrder = layersMap.get(currentFileLayer);

  return !currentFileSlice
    || isImportFromSameSlice
    || hasUnknownLayers
    || isInsideShared
    || isInsideApp
    || currentFileLayerOrder > importLayerOrder;
};
