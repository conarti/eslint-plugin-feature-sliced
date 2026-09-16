import type { ImportExportNodes } from './models';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { isNodeType } from './is-node-type';

describe('isNodeType', () => {
  it('should return true for an export-all declaration with exportKind "type"', () => {
    const node = {
      type: AST_NODE_TYPES.ExportAllDeclaration,
      exportKind: 'type',
    } as unknown as ImportExportNodes;

    expect(isNodeType(node)).toBe(true);
  });

  it('should return false for an export-named declaration with exportKind "value"', () => {
    const node = {
      type: AST_NODE_TYPES.ExportNamedDeclaration,
      exportKind: 'value',
    } as unknown as ImportExportNodes;

    expect(isNodeType(node)).toBe(false);
  });

  it('should return false for a node that is neither an import nor an export, even when it carries an exportKind property', () => {
    /* No rule ever passes such a shape: exportKind only exists on real export nodes. */
    const node = {
      type: AST_NODE_TYPES.Identifier,
      exportKind: 'type',
    } as unknown as ImportExportNodes;

    expect(isNodeType(node)).toBe(false);
  });
});
