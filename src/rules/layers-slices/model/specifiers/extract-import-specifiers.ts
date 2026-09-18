import type { TSESTree } from '@typescript-eslint/utils';

/**
 * Every specifier of an import declaration takes part in the layer order check.
 * A default or a namespace specifier is a value import; the only way to exempt
 * it is an `import type` declaration, which `validateNode` answers before the
 * specifiers are looked at.
 */
export function extractImportSpecifiers(node: TSESTree.ImportDeclaration): TSESTree.ImportClause[] {
  return node.specifiers;
}
