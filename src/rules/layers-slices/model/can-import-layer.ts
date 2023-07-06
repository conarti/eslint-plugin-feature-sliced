import { type Layer } from '../../../config';
import {
  getLayerWeight,
  type PathsInfo,
} from '../../../lib/fsd-lib';
import { type ImportExportNodesWithSourceValue, isNodeType } from '../../../lib/rule';

type RuleOptions = {
  allowTypeImports: boolean
};

export function canImportLayer(pathsInfo: PathsInfo, node: ImportExportNodesWithSourceValue, ruleOptions: RuleOptions) {
  const {
    fsdPartsOfTarget,
    fsdPartsOfCurrentFile,
    isSameSlice,
    isSameLayerWithoutSlices,
    hasUnknownLayers,
  } = pathsInfo;

  if (hasUnknownLayers) {
    return true;
  }

  const { allowTypeImports } = ruleOptions;
  const isType = isNodeType(node);
  const isTypeAndAllowedToImport = allowTypeImports && isType;

  const importLayerOrder = getLayerWeight(
    fsdPartsOfTarget.layer as Layer, /* ts doesn't understand that the check was done on hasUnknownLayers */
  );
  const currentFileLayerOrder = getLayerWeight(
    fsdPartsOfCurrentFile.layer as Layer, /* ts doesn't understand that the check was done on hasUnknownLayers */
  );
  const isImportLayerBelowCurrent = currentFileLayerOrder > importLayerOrder;

  return isSameSlice
    || isTypeAndAllowedToImport
    || isSameLayerWithoutSlices
    || isImportLayerBelowCurrent;
}
