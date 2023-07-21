import { isNodeType } from '../../../../lib/rule';
import { type ImportNodesWithSource } from '../../../../lib/rule/models';

export function validByTypeImport(node: ImportNodesWithSource, allowTypeImports: boolean) {
  const isType = isNodeType(node);

  return allowTypeImports && isType;
}
