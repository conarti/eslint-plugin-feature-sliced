/**
 * Checks if the path is relative
 * @param path {string}
 * @returns {boolean}
 */
module.exports.isPathRelative = (path) => {
  return path.startsWith('.');
};
