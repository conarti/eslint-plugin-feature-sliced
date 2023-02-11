const { getByRegExp } = require('./getByRegExp');

/**
 * Finds and returns an alias from a path
 * @param target {string}
 * @returns {string|null}
 */
module.exports.getAlias = (target) => {
  const aliasRegExp = /^[^a-zA-Z0-9\/]+\w*/;
  return getByRegExp(target, aliasRegExp);
};
