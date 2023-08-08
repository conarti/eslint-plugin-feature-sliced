import {
  type TSESTree,
  ASTUtils,
  AST_NODE_TYPES,
} from '@typescript-eslint/utils';
import type {
  ExportAllDeclarationKindType,
  ExportNamedDeclarationKindType,
  ImportDeclarationKindType,
  ImportExportNodes,
} from './models';

type ImportExportTypeNode = ImportDeclarationKindType
  | ExportAllDeclarationKindType
  | ExportNamedDeclarationKindType
  | TSESTree.ImportSpecifier & { importKind: 'type' }

/**
 * Checks if a node is an import or export of a type
 */
export function isNodeType(node: ImportExportNodes | TSESTree.ImportSpecifier): node is ImportExportTypeNode {
  const isImport = ASTUtils.isNodeOfTypes([AST_NODE_TYPES.ImportSpecifier, AST_NODE_TYPES.ImportDeclaration])(node);
  const isExport = ASTUtils.isNodeOfTypes([AST_NODE_TYPES.ExportAllDeclaration, AST_NODE_TYPES.ExportNamedDeclaration])(node);

  if (isImport) {
    return node.importKind === 'type';
  }

  if (isExport) {
    return node.exportKind === 'type';
  }

  return false;
}
