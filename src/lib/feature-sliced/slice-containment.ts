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
 * A path together with the slice that slice extraction returned for that very path.
 */
export interface SliceLocation {
  path: string;
  slice: string | null;
}

/**
 * Returns the parts up to and including the directory of the given slice, or null
 * when the path holds no layer or when its own slice name is not one of those parts.
 *
 * The slice is the one already extracted for this path, so the truncation can never
 * disagree with it. The search starts at index 1 because index 0 is the layer, which
 * a slice carrying the layer name would otherwise match first.
 */
function ownSliceDirParts(
  location: SliceLocation,
  layersConfig?: NormalizedLayerConfig[],
): string[] | null {
  if (location.slice === null) {
    return null;
  }

  const parts = sliceDirParts(location.path, layersConfig);

  if (parts === null) {
    return null;
  }

  const sliceIndex = parts.indexOf(location.slice.toLowerCase(), 1);

  if (sliceIndex === -1) {
    return null;
  }

  return parts.slice(0, sliceIndex + 1);
}

/**
 * Checks whether an import never leaves a single slice, in either direction: the
 * target stays inside the slice directory of the current file, or the current file
 * stays inside the slice directory of the target.
 *
 * Both directions are needed because slice extraction falls back to the last path
 * part when the folder after the slice is not a known segment, so either side can
 * resolve to a folder that lies deeper than the slice it actually belongs to.
 */
export function staysInsideOneSlice(
  currentFile: SliceLocation,
  target: SliceLocation,
  layersConfig?: NormalizedLayerConfig[],
): boolean {
  const currentFileParts = ownSliceDirParts(currentFile, layersConfig);
  const targetParts = ownSliceDirParts(target, layersConfig);

  if (currentFileParts === null || targetParts === null) {
    return false;
  }

  return containsOther(currentFileParts, targetParts) || containsOther(targetParts, currentFileParts);
}

/**
 * Checks whether the current file is an `@x` cross-import public api file whose
 * target stays inside the slice that holds the `@x` folder.
 *
 * The directory holding `@x` is taken by position, so no slice is re-derived here. It
 * must sit below a layer: an `@x` folder placed on the layer itself is malformed and
 * answers false rather than swallowing the whole layer.
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

  const sliceDirHoldingCrossImport = currentFileParts.slice(0, crossImportIndex);

  /*
   * The folder holding `@x` has to be a slice, so it must carry the layer and at
   * least one part below it. An `@x` folder placed directly on a layer would
   * otherwise make every path in that layer count as the same slice.
   */
  if (sliceDirHoldingCrossImport.length < 2) {
    return false;
  }

  return containsOther(sliceDirHoldingCrossImport, targetParts);
}
