const { getAliasFromOptions } = require('./getAliasFromOptions');
const { isPathRelative } = require('./isPathRelative');
const { normalizePath } = require('./normalizePath');
const { removeAlias } = require('./removeAlias');
const { getPathParts } = require('./getPathParts');

module.exports.getAliasFromOptions = getAliasFromOptions;
module.exports.isPathRelative = isPathRelative;
module.exports.normalizePath = normalizePath;
module.exports.removeAlias = removeAlias;
module.exports.getPathParts = getPathParts;
