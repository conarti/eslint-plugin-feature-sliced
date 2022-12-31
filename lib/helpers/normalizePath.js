const { normalizePathSeparators } = require('./normalizePathSeparators');
const { removeAlias } = require('./removeAlias');

module.exports.normalizePath = (path, alias) => {
  const normalizedSeparators = normalizePathSeparators(path);
  return removeAlias(normalizedSeparators, alias);
};
