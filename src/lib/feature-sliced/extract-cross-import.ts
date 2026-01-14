import { normalizePath } from '../path';

export interface CrossImportInfo {
  isCrossImport: boolean;
  sourceSlice: string | null;
  targetSlice: string | null;
}

const EMPTY_RESULT: CrossImportInfo = {
  isCrossImport: false,
  sourceSlice: null,
  targetSlice: null,
};

/**
 * Checks if path contains entities layer
 */
function hasEntitiesLayer(path: string): boolean {
  return /(?:^|\/|\\)entities(?:\/|\\)/i.test(path);
}

/**
 * Extracts @x cross-import info from import path.
 *
 * @x is an FSD pattern for controlled cross-imports between slices.
 * Only allowed for the entities layer.
 *
 * Valid patterns:
 * - entities/User/@x/Session
 * - entities/User/@x/Session.ts
 * - @/entities/group/User/@x/Session
 *
 * Invalid patterns:
 * - entities/User/@x/Session/types (nested path)
 * - features/Auth/@x/User (not entities layer)
 *
 * @param path - import path
 * @returns cross-import info
 */
export function extractCrossImportInfo(path: string): CrossImportInfo {
  const normalizedPath = normalizePath(path);

  if (!hasEntitiesLayer(normalizedPath)) {
    return EMPTY_RESULT;
  }

  /*
   * Regex for extracting @x pattern:
   * - (?<sourceSlice>[\w-]+) - source slice (User, user-profile)
   * - \/@x\/ - cross-import marker
   * - (?<targetSlice>[\w-]+) - target slice (Session)
   * - (?:\.[\w]+)?$ - optional file extension at the end
   */
  const crossImportRegex = /(?<sourceSlice>[\w-]+)\/@x\/(?<targetSlice>[\w-]+)(?:\.\w+)?$/;
  const match = normalizedPath.match(crossImportRegex);

  if (!match?.groups) {
    return EMPTY_RESULT;
  }

  const { sourceSlice, targetSlice } = match.groups;

  return {
    isCrossImport: true,
    sourceSlice,
    targetSlice,
  };
}
