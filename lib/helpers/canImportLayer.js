const canImportLayer = (importLayer, currentFileLayer, layerOrder) => {
  const importLayerOrder = layerOrder[importLayer];
  const currentFileLayerOrder = layerOrder[currentFileLayer];

  return currentFileLayerOrder > importLayerOrder;
};

module.exports.canImportLayer = canImportLayer;
