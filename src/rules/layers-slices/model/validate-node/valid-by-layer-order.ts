import type { NormalizedLayerConfig } from '../../../../config';
import type { ExtractedFeatureSlicedParts } from '../../../../lib/feature-sliced';
import { getLayerWeight } from '../../../../lib/feature-sliced';

export function validByLayerOrder(
  fsdPartsOfTarget: ExtractedFeatureSlicedParts,
  fsdPartsOfCurrentFile: ExtractedFeatureSlicedParts,
  config?: NormalizedLayerConfig[],
) {
  const importLayerOrder = getLayerWeight(
    fsdPartsOfTarget.layer as string, /* ts doesn't understand that the check was done on hasUnknownLayers */
    config,
  );
  const currentFileLayerOrder = getLayerWeight(
    fsdPartsOfCurrentFile.layer as string, /* ts doesn't understand that the check was done on hasUnknownLayers */
    config,
  );

  return currentFileLayerOrder > importLayerOrder;
}
