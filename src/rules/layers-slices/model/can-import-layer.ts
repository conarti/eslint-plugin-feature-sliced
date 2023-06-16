import {
  getLayerWeight,
  isLayer,
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
    currentFileSlice,
    isSameSlice,
    isInsideShared,
    isInsideApp,
  } = pathsInfo;
  const { allowTypeImports } = ruleOptions;

  const hasUnknownLayers = !isLayer(importLayer) || !isLayer(currentFileLayer); /* TODO: extract to PathsInfo with correct type. Extracting just constant is not working here */
  const isImportToNotFsdEntity = !currentFileSlice;

  const isInvalidForValidate = hasUnknownLayers
      || isImportToNotFsdEntity
      || isSameSlice;

  if (isInvalidForValidate) {
    return true;
  }

  const isTypeAndAllowedToImport = allowTypeImports && isType;

  const importLayerOrder = getLayerWeight(importLayer);
  const currentFileLayerOrder = getLayerWeight(currentFileLayer);
  const isImportLayerBelowCurrent = currentFileLayerOrder > importLayerOrder;

  return isTypeAndAllowedToImport
    || isInsideShared
    || isInsideApp
    || isImportLayerBelowCurrent;
}
