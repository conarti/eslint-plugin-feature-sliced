/**
 * Search in a string by regular expression. If there is a match, it will return it.
 * @param target
 * @param regExp
 * @param fromEnd return last result
 */
export function getByRegExp<T extends string = string>(target: string, regExp: RegExp, fromEnd = false): T | null {
  const results = target.match(regExp) || [];

  if (fromEnd) {
    const lastResult = results[results.length - 1];
    return lastResult as T || null;
  }

  return results[0] as T || null;
}
