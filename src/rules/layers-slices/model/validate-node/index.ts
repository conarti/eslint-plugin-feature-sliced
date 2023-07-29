import { type PathsInfo } from '../../../../lib/feature-sliced';
import { type ImportNodesWithSource } from '../../../../lib/rule/models';
import { validByLayerOrder } from './valid-by-layer-order';
import { validByTypeImport } from './valid-by-type-import';

export function validateNode(node: ImportNodesWithSource, pathsInfo: PathsInfo, allowTypeImports: boolean) {
  const {
    fsdPartsOfTarget,
    fsdPartsOfCurrentFile,
  } = pathsInfo;

  if (validByTypeImport(node, allowTypeImports)) {
    return true;
  }

  if (validByLayerOrder(fsdPartsOfTarget, fsdPartsOfCurrentFile)) {
    return true;
  }

  return false;
}
