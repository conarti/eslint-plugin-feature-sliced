import type { UnknownRuleContext } from './models';
import { extractCwd } from './extract-cwd';

function createMockContext(cwd?: string): UnknownRuleContext {
  return {
    cwd: cwd,
    getCwd: cwd !== undefined ? () => cwd : undefined,
  } as unknown as UnknownRuleContext;
}

describe('extract-cwd', () => {
  it('should return undefined when cwd is not available', () => {
    const context = { cwd: undefined, getCwd: undefined } as unknown as UnknownRuleContext;

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

  describe('eslint 10 compatibility', () => {
    it('should work with ESLint 10 property-based context API (no getCwd method)', () => {
      const context = {
        cwd: '/Users/project',
      } as unknown as UnknownRuleContext;

      expect(extractCwd(context)).toBe('/Users/project');
    });

    it('should work with ESLint 9 method-based context API (no cwd property)', () => {
      const context = {
        cwd: undefined,
        getCwd: () => '/Users/project',
      } as unknown as UnknownRuleContext;

      expect(extractCwd(context)).toBe('/Users/project');
    });

    it('should prefer cwd property over getCwd method', () => {
      const context = {
        cwd: '/from-property',
        getCwd: () => '/from-method',
      } as unknown as UnknownRuleContext;

      expect(extractCwd(context)).toBe('/from-property');
    });

    it('should normalize Windows path from cwd property', () => {
      const context = {
        cwd: 'C:\\Users\\project',
      } as unknown as UnknownRuleContext;

      expect(extractCwd(context)).toBe('C:/Users/project');
    });

    it('should fall back to getCwd when cwd property is undefined', () => {
      const context = {
        cwd: undefined,
        getCwd: () => 'C:\\Users\\project',
      } as unknown as UnknownRuleContext;

      expect(extractCwd(context)).toBe('C:/Users/project');
    });
  });
});
