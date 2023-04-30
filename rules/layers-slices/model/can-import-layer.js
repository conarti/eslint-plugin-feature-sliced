module.exports.canImportLayer = (importLayer, currentFileLayer, currentFileSlice, layersMap) => {
  if (!currentFileSlice) {
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
