import {
  type Layer,
  layers,
} from '../../config';
import { getByRegExp } from '../shared';

function prepareToExtract(targetPath: string, cwd?: string): string {
  const lowerCasedTargetPath = targetPath.toLowerCase();

  if (cwd === undefined) {
    return lowerCasedTargetPath;
  }

  const lowerCasedCwd = cwd.toLowerCase();
  const pathWithoutCwd = lowerCasedTargetPath.replace(lowerCasedCwd, '');
  return pathWithoutCwd;
}

/**
 * Returns the layer from the path
 */
export function extractLayer(targetPath: string, cwd?: string): Layer | null {
  const layersRegExpPattern = `(${layers.join('|')})(?![\\w\\.-])`;
  const layersRegExp = new RegExp(layersRegExpPattern, 'ig');

  const pathForExtract = prepareToExtract(targetPath, cwd);

  return getByRegExp<Layer>(pathForExtract, layersRegExp);
}
