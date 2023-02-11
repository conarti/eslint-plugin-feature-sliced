const { getAliasFromOptions } = require('./get-alias-from-options');
const { isPathRelative } = require('./is-path-relative');
const { normalizePathSeparators } = require('./normalize-path-separators');
const { getLayerSliceFromPath } = require('./get-layer-slice-from-path');
const { normalizePath } = require('./normalize-path');
const { configLib } = require('./config-lib');
const { getByRegExp } = require('./get-by-reg-exp');
const { getAlias } = require('./get-alias');

module.exports.getAliasFromOptions = getAliasFromOptions;
module.exports.isPathRelative = isPathRelative;
module.exports.normalizePathSeparators = normalizePathSeparators;
module.exports.getLayerSliceFromPath = getLayerSliceFromPath;
module.exports.normalizePath = normalizePath;
module.exports.configLib = configLib;
module.exports.getByRegExp = getByRegExp;
module.exports.getAlias = getAlias;
