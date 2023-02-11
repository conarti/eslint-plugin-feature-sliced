/**
 * Search in a string by regular expression. If there is a match, it will return it.
 * @param target {string}
 * @param regExp {RegExp}
 * @returns {string|null}
 */
module.exports.getByRegExp = (target, regExp) => (target.match(regExp) || [])[0] || null;
