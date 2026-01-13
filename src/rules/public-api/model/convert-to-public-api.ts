import type { PathsInfo } from '../../../lib/feature-sliced';
import { isNull } from '../../../lib/shared';

function addSlashToStart(targetPath: string | null): string {
  if (isNull(targetPath)) {
    return '';
  }

  return `/${targetPath}`;
}

/**
 * Извлекает вложенный путь после @x/TargetSlice.
 * Для "@x/Session/types" возвращает "types".
 * Для "@x/Session" возвращает null.
 */
function extractCrossImportNestedPath(targetPath: string): string | null {
  const match = targetPath.match(/@x\/[\w-]+\/(.+)$/);
  return match ? match[1] : null;
}

function extractValueToRemove(pathsInfo: PathsInfo): string | null {
  const {
    isSameSlice,
    normalizedTargetPath,
    fsdPartsOfTarget,
  } = pathsInfo;

  /*
   * Для @x путей с вложенностью — вернуть вложенную часть
   */
  const crossImportNestedPath = extractCrossImportNestedPath(normalizedTargetPath);
  if (crossImportNestedPath) {
    return crossImportNestedPath;
  }

  if (isSameSlice) {
    return fsdPartsOfTarget.segmentFiles;
  }

  return `${fsdPartsOfTarget.segment}${addSlashToStart(fsdPartsOfTarget.segmentFiles)}`;
}

export function convertToPublicApi(pathsInfo: PathsInfo): [string, (string | null)] {
  const { normalizedTargetPath } = pathsInfo;

  const valueToRemove = extractValueToRemove(pathsInfo);

  let publicApiPath = normalizedTargetPath.replace(`/${valueToRemove}`, '');

  /* Remove any file extension from directory references (e.g., "@/entities/node.ts" -> "@/entities/node") */
  publicApiPath = publicApiPath.replace(/\.\w+$/, '');

  return [publicApiPath, valueToRemove];
}
