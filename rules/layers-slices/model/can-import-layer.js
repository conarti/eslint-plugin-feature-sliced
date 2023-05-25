const { layersMap } = require('../../../lib/constants');

module.exports.canImportLayer = (pathsInfo) => {
  const {
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  if (!currentFileSlice) {
    return true;
  }

  const isImportFromSameSlice = importSlice === currentFileSlice;

  if (isImportFromSameSlice) {
    return true;
  }

  const hasUnknownLayers = !layersMap.has(importLayer) || !layersMap.has(currentFileLayer);

  if (hasUnknownLayers) {
    return true;
  }

  const isInsideShared = importLayer === 'shared' && currentFileLayer === 'shared';
  const isInsideApp = importLayer === 'app' && currentFileLayer === 'app';

  if (isInsideShared || isInsideApp) {
    return true;
  }

  const importLayerOrder = layersMap.get(importLayer);
  const currentFileLayerOrder = layersMap.get(currentFileLayer);

  return currentFileLayerOrder > importLayerOrder;
};
