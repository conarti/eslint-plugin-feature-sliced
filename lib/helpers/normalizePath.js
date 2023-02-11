const { normalizePathSeparators } = require('./normalizePathSeparators');

const removeAlias = (targetPath, alias) => {
  if (!alias) {
    return targetPath;
  }
  return targetPath.replace(`${alias}/`, '');
};

module.exports.normalizePath = (path, alias) => {
  const normalizedSeparators = normalizePathSeparators(path);
  return removeAlias(normalizedSeparators, alias);
};
