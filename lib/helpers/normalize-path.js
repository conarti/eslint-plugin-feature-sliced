const { normalizePathSeparators } = require('./normalize-path-separators');

module.exports.normalizePath = (path) => {
  return normalizePathSeparators(path);
};
