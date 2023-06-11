/**
 * Checks if the path is relative
 */
export function isPathRelative(path: string): boolean {
  return path.startsWith('.');
}
