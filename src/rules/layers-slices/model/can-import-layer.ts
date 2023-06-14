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
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;
  const { allowTypeImports } = ruleOptions;

  const hasUnknownLayers = !isLayer(importLayer) || !isLayer(currentFileLayer); /* TODO: extract to PathsInfo with correct type. Extracting just constant is not working here */
  const isImportToNotFsdEntity = !currentFileSlice;
  const isImportFromSameSlice = importSlice === currentFileSlice;

  const isInvalidForValidate = hasUnknownLayers
      || isImportToNotFsdEntity
      || isImportFromSameSlice;

  if (isInvalidForValidate) {
    return true;
  }

  const isTypeAndAllowedToImport = allowTypeImports && isType;

  const isInsideShared = importLayer === 'shared' && currentFileLayer === 'shared';
  const isInsideApp = importLayer === 'app' && currentFileLayer === 'app';

  const importLayerOrder = getLayerWeight(importLayer);
  const currentFileLayerOrder = getLayerWeight(currentFileLayer);
  const isImportLayerBelowCurrent = currentFileLayerOrder > importLayerOrder;

  return isTypeAndAllowedToImport
    || isInsideShared
    || isInsideApp
    || isImportLayerBelowCurrent;
}
