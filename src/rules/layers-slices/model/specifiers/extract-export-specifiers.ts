import type { TSESTree } from '@typescript-eslint/utils';

/**
 * Every specifier of a named re-export takes part in the layer order check, the way every
 * specifier of an import does. Nothing is filtered out here: a named re-export carries only
 * export specifiers, and `export * from` reaches no specifier at all.
 */
export function extractExportSpecifiers(node: TSESTree.ExportNamedDeclarationWithSource): TSESTree.ExportSpecifier[] {
  return node.specifiers;
}
