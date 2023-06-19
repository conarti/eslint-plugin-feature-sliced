import { type Layer } from '../../../config';
import {
  getLayerWeight,
  type PathsInfo,
} from '../../../lib/fsd-lib';

type RuleOptions = {
  allowTypeImports: boolean
};

export function canImportLayer(pathsInfo: PathsInfo, ruleOptions: RuleOptions) {
  const {
    isType,
    importLayer,
    currentFileLayer,
    isSameSlice,
    isSameLayerWithoutSlices,
    hasUnknownLayers,
  } = pathsInfo;
  const { allowTypeImports } = ruleOptions;

  const isInvalidForValidate = hasUnknownLayers || isSameSlice;

  if (isInvalidForValidate) {
    return true;
  }

  const isTypeAndAllowedToImport = allowTypeImports && isType;

  const importLayerOrder = getLayerWeight(importLayer as Layer /* ts doesn't understand that the check was done on hasUnknownLayers */);
  const currentFileLayerOrder = getLayerWeight(currentFileLayer as Layer /* ts doesn't understand that the check was done on hasUnknownLayers */);
  const isImportLayerBelowCurrent = currentFileLayerOrder > importLayerOrder;

  return isTypeAndAllowedToImport
    || isSameLayerWithoutSlices
    || isImportLayerBelowCurrent;
}
