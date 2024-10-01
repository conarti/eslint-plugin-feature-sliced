import type { TSESTree } from '@typescript-eslint/utils';
import type { ImportNodesWithSource } from '../../../../lib/rule/models';
import { isNodeType } from '../../../../lib/rule';

export function validByTypeImport(node: ImportNodesWithSource | TSESTree.ImportSpecifier, allowTypeImports: boolean) {
  const isType = isNodeType(node);

  return allowTypeImports && isType;
}
