import picomatch from 'picomatch';

/**
 * Checks if the path needs to be validated against patterns to ignore
 */
export function isIgnored(path: string, patterns?: string[]): boolean {
  if (!Array.isArray(patterns)) {
    return false;
  }

  const match = picomatch(patterns);

  return match(path);
}
