import type { NormalizedLayerConfig } from '../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from './layers-config';
import { relativeToRoot } from './resolution-paths';

const CROSS_IMPORT_DIR = '@x';

/**
 * Returns the path parts from the layer onward, lowercased, or null when the path
 * holds no layer that can contain slices or nothing follows that layer.
 *
 * The parts are compared instead of the raw path because a target path is only
 * made absolute when the specifier is relative: an aliased or a bare specifier
 * reaches the rules unchanged and shares no prefix with the current file path.
 *
 * The layer is looked for below the project root. Nothing forbids holding a checkout in a
 * folder named after a layer, and a search that starts at the top of an absolute path stops
 * at that folder, which puts the whole slice prefix one branch too high. A path that lies
 * under no root is read as written, which is what an aliased or a bare specifier is.
 *
 * @example
 * 'src/entities/Foo/model/thing.ts' -> ['entities', 'foo', 'model', 'thing.ts']
 * '@/entities/foo/model/thing' -> ['entities', 'foo', 'model', 'thing']
 */
export function sliceDirParts(
  targetPath: string,
  layersConfig?: NormalizedLayerConfig[],
  root?: string,
): string[] | null {
  const layersWithSlices = getLayersWithSlices(layersConfig ?? normalizeLayersConfig());

  const parts = (relativeToRoot(targetPath, root) ?? targetPath)
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
  /**
   * Where that slice sits: its index among the path parts after the layer, when the
   * filesystem resolved the boundary. Without one the name is searched for, which is
   * all the path heuristic can offer.
   */
  sliceIndex?: number | null;
}

/**
 * Returns the parts up to and including the directory of the given slice, or null
 * when the path holds no layer or when its own slice name is not one of those parts.
 *
 * The slice is the one already extracted for this path, so the truncation can never
 * disagree with it. A resolved boundary is used as the position it is: a slice that
 * holds a folder of its own name carries the name twice, and a search by name stops
 * at the first of the two, which is the folder above the slice. The search that
 * remains for an unresolved slice starts at index 1 because index 0 is the layer,
 * which a slice carrying the layer name would otherwise match first.
 */
function ownSliceDirParts(
  location: SliceLocation,
  layersConfig?: NormalizedLayerConfig[],
  root?: string,
): string[] | null {
  if (location.slice === null) {
    return null;
  }

  const parts = sliceDirParts(location.path, layersConfig, root);

  if (parts === null) {
    return null;
  }

  const sliceName = location.slice.toLowerCase();

  /* `parts` starts at the layer, so the slice sits one further along than the boundary counts */
  const sliceIndex = location.sliceIndex === undefined || location.sliceIndex === null
    ? parts.indexOf(sliceName, 1)
    : location.sliceIndex + 1;

  if (parts[sliceIndex] !== sliceName) {
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
  root?: string,
): boolean {
  const currentFileParts = ownSliceDirParts(currentFile, layersConfig, root);
  const targetParts = ownSliceDirParts(target, layersConfig, root);

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
  root?: string,
): boolean {
  const currentFileParts = sliceDirParts(currentFilePath, layersConfig, root);
  const targetParts = sliceDirParts(targetPath, layersConfig, root);

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
