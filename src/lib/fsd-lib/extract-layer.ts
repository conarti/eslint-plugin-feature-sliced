import {
  type Layer,
  layers,
} from '../../config';
import { getByRegExp } from '../shared';

/**
 * Returns the layer from the path
 */
export function extractLayer(targetPath: string): Layer | null {
  const layersRegExpPattern = `(${layers.join('|')})(?![\\w\\.-])`;
  const layersRegExp = new RegExp(layersRegExpPattern, 'ig');
  const lowerCasedTargetPath = targetPath.toLowerCase();

  return getByRegExp<Layer>(lowerCasedTargetPath, layersRegExp, true);
}
