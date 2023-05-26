const micromatch = require('micromatch');

/**
 * Checks if the path needs to be validated against patterns to ignore
 * @param path {string}
 * @param patterns {string[]|undefined}
 * @returns {boolean}
 */
module.exports.isIgnored = function (path, patterns = null) {
  return patterns && micromatch.isMatch(path, patterns);
};
