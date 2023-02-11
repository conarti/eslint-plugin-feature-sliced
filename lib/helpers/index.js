const { getAliasFromOptions } = require('./get-alias-from-options');
const { isPathRelative } = require('./is-path-relative');
const { normalizePathSeparators } = require('./normalize-path-separators');
const { getPathParts } = require('./get-path-parts');
const { normalizePath } = require('./normalize-path');
const { configLib } = require('./config-lib');

module.exports.getAliasFromOptions = getAliasFromOptions;
module.exports.isPathRelative = isPathRelative;
module.exports.normalizePathSeparators = normalizePathSeparators;
module.exports.getPathParts = getPathParts;
module.exports.normalizePath = normalizePath;
module.exports.configLib = configLib;
