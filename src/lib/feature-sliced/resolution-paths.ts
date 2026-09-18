import type { NormalizedLayerConfig } from '../../config';
import {
  getLayerNames,
  normalizeLayersConfig,
} from './layers-config';

/**
 * Returns the path relative to the project root, or null when the path does not lie under it.
 *
 * The comparison is case insensitive because a project root and a file path can disagree on
 * case, but the slice of the original string is returned untouched: a lowercased directory
 * does not exist on a case sensitive filesystem, and this path is handed to a directory read.
 * This is why `extract-layer.ts`'s `prepareToExtract` cannot be reused here.
 *
 * Lying under the root means the root, then a separator or nothing. A bare prefix test would
 * put `/projects/src` under `/proj` and cut it mid-name into `ects/src`, which names a
 * directory that exists nowhere, is probed as if it did, and is cached under that name for
 * the rest of the process.
 */
export function relativeToRoot(targetPath: string, root?: string): string | null {
  if (root === undefined || root === '') {
    return null;
  }

  if (!targetPath.toLowerCase().startsWith(root.toLowerCase())) {
    return null;
  }

  const pathFromRoot = targetPath.slice(root.length);

  if (pathFromRoot !== '' && !pathFromRoot.startsWith('/') && !root.endsWith('/')) {
    return null;
  }

  return pathFromRoot.replace(/^\/+/, '');
}

/**
 * Rebuilds an import target as a path under the current file's layer root.
 *
 * `convertToAbsolute` only roots a relative specifier, so an aliased or a bare target
 * (`@/widgets/header/hooks`, `src/widgets/header/hooks`) reaches the rules as a string that
 * points at no directory on disk. The current file's path is always real, so the directory
 * holding its layer is the directory the target's own layer sits in too.
 *
 * Returns null when either side carries no layer, which is the case for a package specifier.
 *
 * @example
 * current '/proj/src/widgets/header/Header.ts', target '@/entities/user/model'
 *   -> '/proj/src/entities/user/model'
 */
export function rerootTargetPath(
  currentFilePath: string,
  targetPath: string,
  root?: string,
  layersConfig?: NormalizedLayerConfig[],
): string | null {
  const currentFileFromRoot = relativeToRoot(currentFilePath, root);

  if (currentFileFromRoot === null) {
    return null;
  }

  const layerNames = getLayerNames(layersConfig ?? normalizeLayersConfig())
    .map((layerName) => layerName.toLowerCase());

  const currentFileParts = currentFileFromRoot.split('/').filter(Boolean);
  const currentFileLayerIndex = currentFileParts.findIndex((part) => layerNames.includes(part.toLowerCase()));

  if (currentFileLayerIndex === -1) {
    return null;
  }

  const targetParts = targetPath.split('/').filter(Boolean);
  const targetLayerIndex = targetParts.findIndex((part) => layerNames.includes(part.toLowerCase()));

  if (targetLayerIndex === -1) {
    return null;
  }

  return [
    root,
    ...currentFileParts.slice(0, currentFileLayerIndex),
    ...targetParts.slice(targetLayerIndex),
  ].join('/');
}
