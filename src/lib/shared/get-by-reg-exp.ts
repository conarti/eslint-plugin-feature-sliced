/**
 * Search in a string by regular expression. If there is a match, it will return it.
 * @param target
 * @param regExp
 */
export function getByRegExp<T extends string = string>(target: string, regExp: RegExp): T | null {
  const results = target.match(regExp) || [];

  return results[0] as T || null;
}
