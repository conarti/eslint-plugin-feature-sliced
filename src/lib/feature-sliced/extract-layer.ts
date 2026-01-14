import type { NormalizedLayerConfig } from '../../config';
import { getByRegExp } from '../shared';
import {
  getLayerNames,
  normalizeLayersConfig,
} from './layers-config';

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
 * Returns the layer from the path.
 * If config is not provided, uses default FSD layers.
 */
export function extractLayer(
  targetPath: string,
  cwd?: string,
  config?: NormalizedLayerConfig[],
): string | null {
  const layersConfig = config ?? normalizeLayersConfig();
  const layerNames = getLayerNames(layersConfig);
  const layersRegExpPattern = `(${layerNames.join('|')})(?![\\w\\.-])`;
  const layersRegExp = new RegExp(layersRegExpPattern, 'gi');

  const pathForExtract = prepareToExtract(targetPath, cwd);

  return getByRegExp<string>(pathForExtract, layersRegExp);
}
