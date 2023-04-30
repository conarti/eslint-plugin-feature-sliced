/**
 * Search in a string by regular expression. If there is a match, it will return it.
 * @param target {string}
 * @param regExp {RegExp}
 * @param fromEnd {boolean} return last result
 * @returns {string|null}
 */
module.exports.getByRegExp = (target, regExp, fromEnd = false) => {
  const results = target.match(regExp) || [];

  if (fromEnd) {
    const lastResult = results[results.length - 1];
    return lastResult || null;
  }

  return results[0] || null;
};
