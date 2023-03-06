const path = require('path');
const { pathSeparator } = require('../constants');

const normalizePathSeparators = (targetPath) => {
  return targetPath.replaceAll(path.win32.sep, pathSeparator);
};

module.exports.normalizePath = (targetPath) => {
  const withNormalizedSeparators = normalizePathSeparators(targetPath);
  const normalizedPath = path.normalize(withNormalizedSeparators);

  if (withNormalizedSeparators.startsWith('./')) {
    return `./${normalizedPath}`;
  }

  return normalizedPath;
};
