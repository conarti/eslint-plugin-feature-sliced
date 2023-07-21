import {
  type ImportExportNodesWithSourceValue,
  isNodeType,
} from '../../../../lib/rule';

export function validByTypeImport(node: ImportExportNodesWithSourceValue, allowTypeImports: boolean) {
  const isType = isNodeType(node);

  return allowTypeImports && isType;
}
