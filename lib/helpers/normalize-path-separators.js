const path = require('path');
const { pathSeparator } = require('../constants');

module.exports.normalizePathSeparators = (targetPath) => {
  return path.normalize(targetPath).replace(/\\/g, pathSeparator);
};
