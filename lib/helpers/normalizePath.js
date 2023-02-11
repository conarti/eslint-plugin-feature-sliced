const { layers } = require('../constants');
const { normalizePathSeparators } = require('./normalizePathSeparators');

const layersNames = Object.keys(layers);

const getByRegExp = (target, regExp) => (target.match(regExp) || [])[0];

const getAlias = (target) => {
  const aliasRegExp = /^[^a-zA-Z0-9\/]+\w*/;
  return getByRegExp(target, aliasRegExp);
};

const removeAlias = (targetPath) => {
  const alias = getAlias(targetPath);

  if (!alias) {
    return targetPath;
  }

  const resultWithoutAlias = targetPath.replace(alias, '').replace(/^\//, '');

  const layersRegExp = new RegExp(`(${layersNames.join('|')})`);
  const hasLayerInResult = layersRegExp.test(resultWithoutAlias);

  if (hasLayerInResult) {
    return resultWithoutAlias;
  }

  const layerFromTarget = getByRegExp(targetPath, layersRegExp);

  return `${layerFromTarget}/${resultWithoutAlias}`;
};

module.exports.normalizePath = (path) => {
  const normalizedSeparators = normalizePathSeparators(path);
  return removeAlias(normalizedSeparators);
};
