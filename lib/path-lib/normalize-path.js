const path = require('path');
const { pathSeparator } = require('../../config');

module.exports.normalizePath = (targetPath) => {
  const withNormalizedSeparators = path
    .normalize(targetPath)
    .replaceAll(path.win32.sep, pathSeparator);

  if (targetPath.startsWith('./')) {
    return `./${withNormalizedSeparators}`;
  }

  return withNormalizedSeparators;
};