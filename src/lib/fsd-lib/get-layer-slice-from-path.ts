import { type Layer } from '../../config';
import { extractLayer } from './extract-layer';
import { extractSlice } from './extract-slice';

/**
 * Returns the layer and slice from the path
 * TODO: split into two functions
 */
export function getLayerSliceFromPath(filePath: string): [Layer | null, string | null] {
  const layer = extractLayer(filePath);
  const slice = extractSlice(filePath);
  return [layer, slice];
}
