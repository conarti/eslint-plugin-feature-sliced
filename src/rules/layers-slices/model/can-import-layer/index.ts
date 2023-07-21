import { type PathsInfo } from '../../../../lib/feature-sliced';
import { type ImportExportNodesWithSourceValue } from '../../../../lib/rule';
import { validByLayerOrder } from './valid-by-layer-order';
import { validByTypeImport } from './valid-by-type-import';

type RuleOptions = {
  allowTypeImports: boolean
};

export function canImportLayer(pathsInfo: PathsInfo, node: ImportExportNodesWithSourceValue, ruleOptions: RuleOptions) {
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
