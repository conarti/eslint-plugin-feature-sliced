const { getAliasFromOptions } = require('./getAliasFromOptions');
const { isPathRelative } = require('./isPathRelative');
const { normalizePathSeparators } = require('./normalizePathSeparators');
const { getPathParts } = require('./getPathParts');
const { normalizePath } = require('./normalizePath');
const { configLib } = require('./configLib');

module.exports.getAliasFromOptions = getAliasFromOptions;
module.exports.isPathRelative = isPathRelative;
module.exports.normalizePathSeparators = normalizePathSeparators;
module.exports.getPathParts = getPathParts;
module.exports.normalizePath = normalizePath;
module.exports.configLib = configLib;
