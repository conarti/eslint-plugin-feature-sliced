import micromatch from 'micromatch';

/**
 * Checks if the path needs to be validated against patterns to ignore
 */
export function isIgnored(path: string, patterns: string[] = null): boolean {
  return patterns && micromatch.isMatch(path, patterns);
}
