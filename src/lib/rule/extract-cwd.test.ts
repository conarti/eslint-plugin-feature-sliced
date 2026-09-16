import type { UnknownRuleContext } from './models';
import { extractCwd } from './extract-cwd';

describe('extract-cwd', () => {
  describe('context api shapes', () => {
    it('should prefer cwd property over getCwd method', () => {
      const context = {
        cwd: '/from-property',
        getCwd: () => '/from-method',
      } as unknown as UnknownRuleContext;

      expect(extractCwd(context)).toBe('/from-property');
    });

    describe('property based (eslint 10)', () => {
      it('should return Unix cwd unchanged', () => {
        const context = {
          cwd: '/Users/project/src',
        } as unknown as UnknownRuleContext;

        expect(extractCwd(context)).toBe('/Users/project/src');
      });

      it('should normalize Windows cwd to Unix format', () => {
        const context = {
          cwd: 'C:\\Users\\project\\src',
        } as unknown as UnknownRuleContext;

        expect(extractCwd(context)).toBe('C:/Users/project/src');
      });

      it('should handle mixed separators', () => {
        const context = {
          cwd: 'C:/Users\\project/src',
        } as unknown as UnknownRuleContext;

        expect(extractCwd(context)).toBe('C:/Users/project/src');
      });

      it('should return undefined when cwd is not available', () => {
        const context = {
          cwd: undefined,
        } as unknown as UnknownRuleContext;

        expect(extractCwd(context)).toBeUndefined();
      });
    });

    describe('method based (eslint 9)', () => {
      it('should return Unix cwd unchanged', () => {
        const context = {
          getCwd: () => '/Users/project',
        } as unknown as UnknownRuleContext;

        expect(extractCwd(context)).toBe('/Users/project');
      });

      it('should normalize Windows cwd to Unix format', () => {
        const context = {
          getCwd: () => 'C:\\Users\\project',
        } as unknown as UnknownRuleContext;

        expect(extractCwd(context)).toBe('C:/Users/project');
      });

      it('should handle mixed separators', () => {
        const context = {
          getCwd: () => 'C:/Users\\project/src',
        } as unknown as UnknownRuleContext;

        expect(extractCwd(context)).toBe('C:/Users/project/src');
      });

      it('should return undefined when getCwd returns undefined', () => {
        const context = {
          getCwd: () => undefined,
        } as unknown as UnknownRuleContext;

        expect(extractCwd(context)).toBeUndefined();
      });
    });
  });
});
