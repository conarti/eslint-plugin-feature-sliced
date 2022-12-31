const { getAliasFromOptions } = require('./getAliasFromOptions');
const { isPathRelative } = require('./isPathRelative');
const { normalizePathSeparators } = require('./normalizePathSeparators');
const { removeAlias } = require('./removeAlias');
const { getPathParts } = require('./getPathParts');
const { normalizePath } = require('./normalizePath');

module.exports.getAliasFromOptions = getAliasFromOptions;
module.exports.isPathRelative = isPathRelative;
module.exports.normalizePathSeparators = normalizePathSeparators;
module.exports.removeAlias = removeAlias;
module.exports.getPathParts = getPathParts;
module.exports.normalizePath = normalizePath;
