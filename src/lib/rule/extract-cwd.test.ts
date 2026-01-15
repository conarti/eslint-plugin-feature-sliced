import type { UnknownRuleContext } from './models';
import { extractCwd } from './extract-cwd';

function createMockContext(cwd?: string): UnknownRuleContext {
  return {
    getCwd: cwd !== undefined ? () => cwd : undefined,
  } as unknown as UnknownRuleContext;
}

describe('extract-cwd', () => {
  it('should return undefined when getCwd is not available', () => {
    const context = { getCwd: undefined } as unknown as UnknownRuleContext;

    expect(extractCwd(context)).toBeUndefined();
  });

  it('should normalize Windows cwd to Unix format', () => {
    const context = createMockContext('C:\\Users\\project\\src');

    expect(extractCwd(context)).toBe('C:/Users/project/src');
  });

  it('should return Unix cwd unchanged', () => {
    const context = createMockContext('/Users/project/src');

    expect(extractCwd(context)).toBe('/Users/project/src');
  });

  it('should handle mixed separators', () => {
    const context = createMockContext('C:/Users\\project/src');

    expect(extractCwd(context)).toBe('C:/Users/project/src');
  });

  it('should return undefined when getCwd returns undefined', () => {
    const context = {
      getCwd: () => undefined,
    } as unknown as UnknownRuleContext;

    expect(extractCwd(context)).toBeUndefined();
  });
});
