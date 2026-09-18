import type { TSESTree } from '@typescript-eslint/utils';
import type {
  ExportNodesWithSource,
  ImportNodesWithSource,
} from '../../../../lib/rule/models';
import { isNodeType } from '../../../../lib/rule';

export function validByTypeImport(node: ImportNodesWithSource | ExportNodesWithSource | TSESTree.ImportClause, allowTypeImports: boolean) {
  const isType = isNodeType(node);

  return allowTypeImports && isType;
}
