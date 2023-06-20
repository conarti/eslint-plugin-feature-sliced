import {
  layersWithSlices,
  type Layer,
} from '../../config';
import { getByRegExp } from '../shared';
import { extractLayer } from './extract-layer';

/**
 * Returns the slice from the path
 */
function getSliceFromPath(targetPath: string): string | null {
  const targetPathWithoutCurrentFileName = targetPath.replace(/\/\w+\.\w+$/, '');
  return getByRegExp(targetPathWithoutCurrentFileName, new RegExp(`(?<=(${layersWithSlices.join('|')})\\/)(\\w|-)+`, 'ig'), true);
}

/**
 * Returns the layer and slice from the path
 * TODO: split into two functions
 */
export function getLayerSliceFromPath(filePath: string): [Layer | null, string | null] {
  const layer = extractLayer(filePath);
  const slice = getSliceFromPath(filePath);
  return [layer, slice];
}
