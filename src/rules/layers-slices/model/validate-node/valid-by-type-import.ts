import type {
  ExportNodesWithSource,
  ImportExportSpecifier,
  ImportNodesWithSource,
} from '../../../../lib/rule/models';
import { isNodeType } from '../../../../lib/rule';

export function validByTypeImport(node: ImportNodesWithSource | ExportNodesWithSource | ImportExportSpecifier, allowTypeImports: boolean) {
  const isType = isNodeType(node);

  return allowTypeImports && isType;
}
