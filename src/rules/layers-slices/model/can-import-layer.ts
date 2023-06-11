import {
  getLayerWeight,
  isLayer,
} from '../../../lib/fsd-lib';
import type { Options } from '../config';

function isPathsIncorrectForValidate(pathsInfo) {
  const {
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  const isImportToNotFsdEntity = !currentFileSlice; /* TODO: move to 'extractPathsInfo' */
  const isImportFromSameSlice = importSlice === currentFileSlice; /* TODO: move to 'extractPathsInfo' */
  const hasUnknownLayers = !isLayer(importLayer) || !isLayer(currentFileLayer); /* TODO: move to 'extractPathsInfo' */

  return isImportToNotFsdEntity // FIXME: is it needed here? removing this won't break any test
    || isImportFromSameSlice
    || hasUnknownLayers;
}

type RuleOptions = Options[0];

export function canImportLayer(pathsInfo, ruleOptions: RuleOptions) {
  const {
    isType,
    importLayer,
    currentFileLayer,
  } = pathsInfo;
  const { allowTypeImports } = ruleOptions;

  const isTypeAndAllowedToImport = allowTypeImports && isType;

  const isInsideShared = importLayer === 'shared' && currentFileLayer === 'shared';
  const isInsideApp = importLayer === 'app' && currentFileLayer === 'app';

  const importLayerOrder = getLayerWeight(importLayer);
  const currentFileLayerOrder = getLayerWeight(currentFileLayer);
  const isImportLayerBelowCurrent = currentFileLayerOrder > importLayerOrder;

  return isPathsIncorrectForValidate(pathsInfo)
    || isTypeAndAllowedToImport
    || isInsideShared
    || isInsideApp
    || isImportLayerBelowCurrent;
}
