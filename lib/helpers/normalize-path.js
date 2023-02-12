const path = require('path');
const { pathSeparator } = require('../constants');

const normalizePathSeparators = (targetPath) => {
  return path.normalize(targetPath).replace(/\\/g, pathSeparator);
};

module.exports.normalizePath = (path) => {
  return normalizePathSeparators(path);
};
