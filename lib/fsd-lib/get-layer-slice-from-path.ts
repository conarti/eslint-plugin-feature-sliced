import type { Layer } from '../../config';
import { layers } from '../../config';
import { getByRegExp } from '../shared';

const layersRegExpPattern = `(${layers.join('|')})(?![\\w\\.-])`;

/**
 * Returns the layer from the path
 */
function getLayerFromPath(targetPath: string): Layer | null {
  const layer = getByRegExp<Layer>(targetPath, new RegExp(layersRegExpPattern, 'ig'), true);

  if (typeof layer === 'string') {
    return layer.toLowerCase() as Layer; // FIXME
  }

  return layer;
}

/**
 * Returns the slice from the path
 */
function getSliceFromPath(targetPath: string): string | null {
  const targetPathWithoutCurrentFileName = targetPath.replace(/\/\w+\.\w+$/, '');
  return getByRegExp(targetPathWithoutCurrentFileName, new RegExp(`(?<=(${layers.join('|')})\\/)(\\w|-)+`, 'ig'), true);
}

/**
 * Returns the layer and slice from the path
 */
export function getLayerSliceFromPath(filePath: string): [Layer | null, string | null] {
  const layer = getLayerFromPath(filePath);
  const slice = getSliceFromPath(filePath);
  return [layer, slice];
}
