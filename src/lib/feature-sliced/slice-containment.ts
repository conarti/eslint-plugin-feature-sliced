import type { NormalizedLayerConfig } from '../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from './layers-config';

const CROSS_IMPORT_DIR = '@x';

/**
 * Returns the path parts from the layer onward, lowercased, or null when the path
 * holds no layer that can contain slices or nothing follows that layer.
 *
 * The parts are compared instead of the raw path because a target path is only
 * made absolute when the specifier is relative: an aliased or a bare specifier
 * reaches the rules unchanged and shares no prefix with the current file path.
 *
 * @example
 * 'src/entities/Foo/model/thing.ts' -> ['entities', 'foo', 'model', 'thing.ts']
 * '@/entities/foo/model/thing' -> ['entities', 'foo', 'model', 'thing']
 */
export function sliceDirParts(
  targetPath: string,
  layersConfig?: NormalizedLayerConfig[],
): string[] | null {
  const layersWithSlices = getLayersWithSlices(layersConfig ?? normalizeLayersConfig());

  const parts = targetPath
    .split('/')
    .filter(Boolean)
    .map((part) => part.toLowerCase());

  const layerIndex = parts.findIndex((part) => layersWithSlices.includes(part));

  if (layerIndex === -1 || layerIndex >= parts.length - 1) {
    return null;
  }

  return parts.slice(layerIndex);
}

/**
 * Checks whether the first parts are a proper prefix of the second ones,
 * which is what "the second path lies inside the first directory" means.
 */
export function containsOther(aParts: string[], bParts: string[]): boolean {
  if (aParts.length >= bParts.length) {
    return false;
  }

  return aParts.every((part, index) => part === bParts[index]);
}

/**
 * Checks whether the current file is an `@x` cross-import public api file whose
 * target stays inside the slice that holds the `@x` folder.
 *
 * The directory holding `@x` is taken by position, so no slice is re-derived here.
 */
export function isCrossImportFileTargetingOwnSlice(
  currentFilePath: string,
  targetPath: string,
  layersConfig?: NormalizedLayerConfig[],
): boolean {
  const currentFileParts = sliceDirParts(currentFilePath, layersConfig);
  const targetParts = sliceDirParts(targetPath, layersConfig);

  if (currentFileParts === null || targetParts === null) {
    return false;
  }

  const crossImportIndex = currentFileParts.indexOf(CROSS_IMPORT_DIR);

  if (crossImportIndex === -1) {
    return false;
  }

  return containsOther(currentFileParts.slice(0, crossImportIndex), targetParts);
}
