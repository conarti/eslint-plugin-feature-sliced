import picomatch from 'picomatch';

/**
 * Checks if the path needs to be validated against patterns to ignore
 */
export function isIgnored(path: string, patterns: string[]): boolean {
  const match = picomatch(patterns);

  return match(path);
}
