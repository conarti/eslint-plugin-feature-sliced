import type { ImportExportNodesWithSourceValue, UnknownRuleContext } from './models';
import { extractPaths } from './extract-paths';

function createMockNode(sourcePath: string): ImportExportNodesWithSourceValue {
  return {
    source: { value: sourcePath },
  } as ImportExportNodesWithSourceValue;
}

function createMockContext(filename: string, cwd?: string): UnknownRuleContext {
  return {
    getPhysicalFilename: () => filename,
    getFilename: () => filename,
    getCwd: cwd !== undefined ? () => cwd : undefined,
  } as unknown as UnknownRuleContext;
}

describe('extract-paths', () => {
  it('should extract paths with Unix cwd', () => {
    const node = createMockNode('../model');
    const context = createMockContext(
      '/Users/project/src/features/foo/ui/index.ts',
      '/Users/project',
    );

    const result = extractPaths(node, context);

    expect(result.targetPath).toBe('../model');
    expect(result.normalizedTargetPath).toBe('../model');
    expect(result.normalizedCurrentFilePath).toBe('/Users/project/src/features/foo/ui/index.ts');
    expect(result.absoluteTargetPath).toBe('/Users/project/src/features/foo/model');
    expect(result.normalizedCwd).toBe('/Users/project');
  });

  it('should extract paths with Windows cwd and normalize', () => {
    const node = createMockNode('..\\model');
    const context = createMockContext(
      'C:\\Users\\project\\src\\features\\foo\\ui\\index.ts',
      'C:\\Users\\project',
    );

    const result = extractPaths(node, context);

    expect(result.normalizedCwd).toBe('C:/Users/project');
    expect(result.normalizedCurrentFilePath).toBe('C:/Users/project/src/features/foo/ui/index.ts');
    expect(result.normalizedTargetPath).toBe('../model');
  });

  it('should handle absolute import paths (alias)', () => {
    const node = createMockNode('@/shared/lib');
    const context = createMockContext('/src/features/foo/ui/index.ts');

    const result = extractPaths(node, context);

    expect(result.targetPath).toBe('@/shared/lib');
    expect(result.absoluteTargetPath).toBe('@/shared/lib');
  });

  it('should handle undefined cwd', () => {
    const node = createMockNode('./utils');
    const context = createMockContext('/src/shared/lib/index.ts');

    const result = extractPaths(node, context);

    expect(result.normalizedCwd).toBeUndefined();
  });

  it('should handle relative import within same directory', () => {
    const node = createMockNode('./types');
    const context = createMockContext(
      '/Users/project/src/entities/user/model/index.ts',
      '/Users/project',
    );

    const result = extractPaths(node, context);

    expect(result.targetPath).toBe('./types');
    expect(result.normalizedTargetPath).toBe('./types');
    expect(result.absoluteTargetPath).toBe('/Users/project/src/entities/user/model/types');
  });
});
