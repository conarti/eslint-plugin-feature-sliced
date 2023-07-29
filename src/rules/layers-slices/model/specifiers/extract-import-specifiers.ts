import {
  AST_NODE_TYPES,
  type TSESTree,
} from '@typescript-eslint/utils';

export function extractImportSpecifiers(node: TSESTree.ImportDeclaration): TSESTree.ImportSpecifier[] {
  return node.specifiers.filter((specifier): specifier is TSESTree.ImportSpecifier => specifier.type === AST_NODE_TYPES.ImportSpecifier);
}
