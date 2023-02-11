const { pathSeparator, layersRegExp } = require('../constants');
const { getByRegExp } = require('./get-by-reg-exp');

/**
 * Returns the layer from the path
 * @param targetPath {string}
 * @returns {string|null}
 */
const getLayerFromPath = (targetPath) => {
  return getByRegExp(targetPath, layersRegExp);
};

/**
 * Returns the slice from the path
 * @param targetPath {string}
 * @returns {string}
 */
const getSliceFromPath = (targetPath) => {
  const layersRegExpString = layersRegExp.toString().replaceAll('/', '');
  return getByRegExp(targetPath, new RegExp(`(?<=${layersRegExpString}\\${pathSeparator})\\w+`));
};

/**
 * Returns the layer and slice from the path
 * @param filePath {string}
 * @returns {['shared' | 'entities' | 'features' | 'widgets' | 'pages' | 'processes' | 'app', string]} Tuple where the first element is a layer, the second is a slice
 */
module.exports.getLayerSliceFromPath = (filePath) => {
  const layer = getLayerFromPath(filePath);
  const slice = getSliceFromPath(filePath);
  return [layer, slice];
};
