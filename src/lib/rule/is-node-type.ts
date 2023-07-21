import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { type TSESTree } from '@typescript-eslint/utils';
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
  const isImport = node.type === AST_NODE_TYPES.ImportDeclaration
    || node.type === AST_NODE_TYPES.ImportSpecifier;
  const isExport = node.type === AST_NODE_TYPES.ExportAllDeclaration
    || node.type === AST_NODE_TYPES.ExportNamedDeclaration;

  if (isImport) {
    return node.importKind === 'type';
  }

  if (isExport) {
    return node.exportKind === 'type';
  }

  return false;
}
