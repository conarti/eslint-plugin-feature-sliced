import {
  type Layer,
  layers,
} from '../../config';
import { getByRegExp } from '../shared';
import { isLayer } from './layers';

/**
 * Returns the layer from the path
 */
export function getLayerFromPath(targetPath: string): Layer | null {
  const layersRegExpPattern = `(${layers.join('|')})(?![\\w\\.-])`;

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
