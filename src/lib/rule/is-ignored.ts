import picomatch from 'picomatch';

/**
 * Checks if the path needs to be validated against patterns to ignore
 */
export function isIgnored(path: string, patterns: string[]): boolean {
  /*
   * Matched twice on purpose. picomatch's `**` does not cross a path segment
   * starting with a dot, so a project under `.worktrees/` or `.cache/` stops
   * matching. Adding `{ dot: true }` alone would flip negated patterns, which
   * can turn an ignored file into a reported one, so the dot-aware result only
   * ever widens the plain one.
   */
  return picomatch(patterns)(path) || picomatch(patterns, { dot: true })(path);
}
