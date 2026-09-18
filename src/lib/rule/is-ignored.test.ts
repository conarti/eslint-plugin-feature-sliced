import { isIgnored } from './is-ignored';

describe('isIgnored', () => {
  it('should ignore a path under a directory whose name starts with a dot', () => {
    expect(isIgnored('/p/.worktrees/w1/src/entities/user/model/a.ts', ['**/entities/**'])).toBe(true);
  });

  it('should ignore the same path without the dot directory', () => {
    expect(isIgnored('/p/src/entities/user/model/a.ts', ['**/entities/**'])).toBe(true);
  });

  it('should not ignore a path that no pattern matches', () => {
    expect(isIgnored('/p/.worktrees/w1/src/entities/user/model/a.ts', ['**/widgets/**'])).toBe(false);
  });

  it('a negated pattern keeps ignoring a dotted file', () => {
    expect(isIgnored('src/.env.ts', ['!src/**'])).toBe(true);
  });

  it('should keep ignoring a dotted path under a negated extension pattern', () => {
    expect(isIgnored('src/.hidden/a.test.ts', ['!**/*.test.ts'])).toBe(true);
  });

  it('should answer the same for a positive pattern with and without a trailing negated one', () => {
    /*
     * picomatch treats a pattern array as an OR, so a trailing negated pattern
     * is a positive match of "not legacy" rather than a subtraction of the
     * previous pattern. Both sets therefore ignore this path. This is the
     * library's semantics, not an oversight of this test.
     */
    const withNegation = isIgnored('src/entities/legacy/a', ['**/entities/**', '!**/entities/legacy/**']);
    const withoutNegation = isIgnored('src/entities/legacy/a', ['**/entities/**']);

    expect(withNegation).toBe(withoutNegation);
    expect(withNegation).toBe(true);
  });
});
