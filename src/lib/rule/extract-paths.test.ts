import type { ImportExportNodesWithSourceValue, UnknownRuleContext } from './models';
import { extractPaths } from './extract-paths';

function createMockNode(sourcePath: string): ImportExportNodesWithSourceValue {
  return {
    source: { value: sourcePath },
  } as ImportExportNodesWithSourceValue;
}

describe('extract-paths', () => {
  describe('context api shapes', () => {
    it('should prefer properties over methods when both are present', () => {
      const node = createMockNode('../model');
      const context = {
        physicalFilename: '/Users/project/src/features/foo/ui/index.ts',
        filename: '/Users/project/src/features/foo/ui/index.ts',
        cwd: '/Users/project',
        getPhysicalFilename: () => '/other/path/src/features/foo/ui/index.ts',
        getFilename: () => '/other/path/src/features/foo/ui/index.ts',
        getCwd: () => '/other/path',
      } as unknown as UnknownRuleContext;

      const result = extractPaths(node, context);

      expect(result.normalizedCurrentFilePath).toBe('/Users/project/src/features/foo/ui/index.ts');
      expect(result.normalizedCwd).toBe('/Users/project');
    });

    describe('property based (eslint 10)', () => {
      it('should extract paths with Unix cwd', () => {
        const node = createMockNode('../model');
        const context = {
          physicalFilename: '/Users/project/src/features/foo/ui/index.ts',
          filename: '/Users/project/src/features/foo/ui/index.ts',
          cwd: '/Users/project',
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.targetPath).toBe('../model');
        expect(result.normalizedTargetPath).toBe('../model');
        expect(result.normalizedCurrentFilePath).toBe('/Users/project/src/features/foo/ui/index.ts');
        expect(result.absoluteTargetPath).toBe('/Users/project/src/features/foo/model');
        expect(result.normalizedCwd).toBe('/Users/project');
      });

      it('should extract paths with Windows cwd and normalize', () => {
        const node = createMockNode('..\\model');
        const context = {
          physicalFilename: 'C:\\Users\\project\\src\\features\\foo\\ui\\index.ts',
          filename: 'C:\\Users\\project\\src\\features\\foo\\ui\\index.ts',
          cwd: 'C:\\Users\\project',
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.normalizedCwd).toBe('C:/Users/project');
        expect(result.normalizedCurrentFilePath).toBe('C:/Users/project/src/features/foo/ui/index.ts');
        expect(result.normalizedTargetPath).toBe('../model');
      });

      it('should handle absolute import paths (alias)', () => {
        const node = createMockNode('@/shared/lib');
        const context = {
          physicalFilename: '/src/features/foo/ui/index.ts',
          filename: '/src/features/foo/ui/index.ts',
          cwd: undefined,
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.targetPath).toBe('@/shared/lib');
        expect(result.absoluteTargetPath).toBe('@/shared/lib');
      });

      it('should handle undefined cwd', () => {
        const node = createMockNode('./utils');
        const context = {
          physicalFilename: '/src/shared/lib/index.ts',
          filename: '/src/shared/lib/index.ts',
          cwd: undefined,
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.normalizedCwd).toBeUndefined();
      });

      it('should handle relative import within same directory', () => {
        const node = createMockNode('./types');
        const context = {
          physicalFilename: '/Users/project/src/entities/user/model/index.ts',
          filename: '/Users/project/src/entities/user/model/index.ts',
          cwd: '/Users/project',
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.targetPath).toBe('./types');
        expect(result.normalizedTargetPath).toBe('./types');
        expect(result.absoluteTargetPath).toBe('/Users/project/src/entities/user/model/types');
      });

      it('should fall back to filename when physicalFilename is undefined', () => {
        const node = createMockNode('../model');
        const context = {
          physicalFilename: undefined,
          filename: '/Users/project/src/features/foo/ui/index.ts',
          cwd: '/Users/project',
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.normalizedCurrentFilePath).toBe('/Users/project/src/features/foo/ui/index.ts');
      });
    });

    describe('method based (eslint 9)', () => {
      it('should extract paths with Unix cwd', () => {
        const node = createMockNode('../model');
        const context = {
          getPhysicalFilename: () => '/Users/project/src/features/foo/ui/index.ts',
          getFilename: () => '/Users/project/src/features/foo/ui/index.ts',
          getCwd: () => '/Users/project',
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.normalizedCurrentFilePath).toBe('/Users/project/src/features/foo/ui/index.ts');
        expect(result.normalizedCwd).toBe('/Users/project');
        expect(result.absoluteTargetPath).toBe('/Users/project/src/features/foo/model');
      });

      it('should extract paths with Windows cwd and normalize', () => {
        const node = createMockNode('..\\model');
        const context = {
          getPhysicalFilename: () => 'C:\\Users\\project\\src\\features\\foo\\ui\\index.ts',
          getFilename: () => 'C:\\Users\\project\\src\\features\\foo\\ui\\index.ts',
          getCwd: () => 'C:\\Users\\project',
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.normalizedCwd).toBe('C:/Users/project');
        expect(result.normalizedCurrentFilePath).toBe('C:/Users/project/src/features/foo/ui/index.ts');
        expect(result.normalizedTargetPath).toBe('../model');
      });

      it('should handle undefined cwd', () => {
        const node = createMockNode('./utils');
        const context = {
          getPhysicalFilename: () => '/src/shared/lib/index.ts',
          getFilename: () => '/src/shared/lib/index.ts',
        } as unknown as UnknownRuleContext;

        const result = extractPaths(node, context);

        expect(result.normalizedCurrentFilePath).toBe('/src/shared/lib/index.ts');
        expect(result.normalizedCwd).toBeUndefined();
      });
    });
  });
});
