import { type Layer } from '../../../../config';
import { getLayerWeight } from '../../../../lib/feature-sliced';
import { type ExtractedFeatureSlicedParts } from '../../../../lib/feature-sliced';

export function validByLayerOrder(fsdPartsOfTarget: ExtractedFeatureSlicedParts, fsdPartsOfCurrentFile: ExtractedFeatureSlicedParts) {
  const importLayerOrder = getLayerWeight(
    fsdPartsOfTarget.layer as Layer, /* ts doesn't understand that the check was done on hasUnknownLayers */
  );
  const currentFileLayerOrder = getLayerWeight(
    fsdPartsOfCurrentFile.layer as Layer, /* ts doesn't understand that the check was done on hasUnknownLayers */
  );

  return currentFileLayerOrder > importLayerOrder;
}
