module.exports.canImportLayer = (importLayer, currentFileLayer, currentFileSlice, layersMap) => {
  if (!currentFileSlice) {
    return true;
  }

  if (importLayer === 'shared' && currentFileLayer === 'shared') {
    return true;
  }

  const importLayerOrder = layersMap.get(importLayer);
  const currentFileLayerOrder = layersMap.get(currentFileLayer);

  return currentFileLayerOrder > importLayerOrder;
};
