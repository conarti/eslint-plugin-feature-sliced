import { type PathsInfo } from '../../../../lib/feature-sliced';
import { type ImportNodesWithSource } from '../../../../lib/rule/models';
import { validByLayerOrder } from './valid-by-layer-order';
import { validByTypeImport } from './valid-by-type-import';

type RuleOptions = {
  allowTypeImports: boolean
};

export function canImportLayer(pathsInfo: PathsInfo, node: ImportNodesWithSource, ruleOptions: RuleOptions) {
  const {
    fsdPartsOfTarget,
    fsdPartsOfCurrentFile,
  } = pathsInfo;

  if (validByTypeImport(node, ruleOptions.allowTypeImports)) {
    return true;
  }

  if (validByLayerOrder(fsdPartsOfTarget, fsdPartsOfCurrentFile)) {
    return true;
  }

  return false;
}
