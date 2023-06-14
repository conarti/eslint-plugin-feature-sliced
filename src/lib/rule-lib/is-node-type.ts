import type {
  ExportAllDeclarationKindType,
  ExportNamedDeclarationKindType,
  ImportDeclarationKindType,
  ImportExportNodes,
} from './models';
import { AST_NODE_TYPES } from '@typescript-eslint/types';

type ImportExportTypeNode = ImportDeclarationKindType | ExportAllDeclarationKindType | ExportNamedDeclarationKindType

/**
 * Checks if a node is an import or export of a type
 */
export function isNodeType(node: ImportExportNodes): node is ImportExportTypeNode {
  const isImport = node.type === AST_NODE_TYPES.ImportDeclaration;
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
