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
 * Проверяет что путь содержит entities слой
 */
function hasEntitiesLayer(path: string): boolean {
  return /(?:^|\/|\\)entities(?:\/|\\)/i.test(path);
}

/**
 * Извлекает информацию о @x cross-import из пути импорта.
 *
 * @x — паттерн FSD для контролируемых cross-imports между слайсами.
 * Разрешён только для слоя entities.
 *
 * Валидные паттерны:
 * - entities/User/@x/Session
 * - entities/User/@x/Session.ts
 * - @/entities/group/User/@x/Session
 *
 * Невалидные паттерны:
 * - entities/User/@x/Session/types (вложенный путь)
 * - features/Auth/@x/User (не entities слой)
 *
 * @param path - путь импорта
 * @returns информация о cross-import
 */
export function extractCrossImportInfo(path: string): CrossImportInfo {
  const normalizedPath = normalizePath(path);

  if (!hasEntitiesLayer(normalizedPath)) {
    return EMPTY_RESULT;
  }

  /*
   * Regex для извлечения @x паттерна:
   * - (?<sourceSlice>[\w-]+) — слайс-источник (User, user-profile)
   * - \/@x\/ — маркер cross-import
   * - (?<targetSlice>[\w-]+) — слайс-получатель (Session)
   * - (?:\.[\w]+)?$ — опциональное расширение файла в конце
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
