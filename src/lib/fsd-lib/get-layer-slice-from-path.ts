import {
  layers,
  layersWithSlices,
  type Layer,
} from '../../config';
import { getByRegExp } from '../shared';
import { isLayer } from './layers';

const layersRegExpPattern = `(${layers.join('|')})(?![\\w\\.-])`;

/**
 * Returns the layer from the path
 */
function getLayerFromPath(targetPath: string): Layer | null {
  const layer = getByRegExp<Layer>(targetPath, new RegExp(layersRegExpPattern, 'ig'), true);

  if (typeof layer !== 'string') {
    return null;
  }

  const lowercasedLayer = layer.toLowerCase();

  if (!isLayer(lowercasedLayer)) {
    return null;
  }

  return lowercasedLayer;
}

/**
 * Returns the slice from the path
 */
function getSliceFromPath(targetPath: string): string | null {
  const targetPathWithoutCurrentFileName = targetPath.replace(/\/\w+\.\w+$/, '');
  return getByRegExp(targetPathWithoutCurrentFileName, new RegExp(`(?<=(${layersWithSlices.join('|')})\\/)(\\w|-)+`, 'ig'), true);
}

/**
 * Returns the layer and slice from the path
 */
export function getLayerSliceFromPath(filePath: string): [Layer | null, string | null] {
  const layer = getLayerFromPath(filePath);
  const slice = getSliceFromPath(filePath);
  return [layer, slice];
}
