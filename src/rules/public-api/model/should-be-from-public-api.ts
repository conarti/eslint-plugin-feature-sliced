import {
  extractCrossImportInfo,
  extractPathsInfo,
  type PathsInfo,
} from '../../../lib/feature-sliced';
import {
  extractRuleOptions,
  type ImportExportNodesWithSourceValue,
} from '../../../lib/rule';
import {
  type Options,
  type RuleContext,
  VALIDATION_LEVEL,
} from '../config';
import { isSegmentsPublicApi } from './is-segments-public-api';
import { isSlicePublicApi } from './is-slice-public-api';

interface ValidateOptions { level: VALIDATION_LEVEL };

/**
 * Проверяет, является ли @x путь вложенным (невалидным).
 * Валидные: @x/Session, @x/Session.ts
 * Невалидные: @x/Session/types, @x/Session/model/hooks
 */
function hasNestedCrossImportPath(targetPath: string): boolean {
  const crossImportInfo = extractCrossImportInfo(targetPath);

  if (crossImportInfo.isCrossImport) {
    return false;
  }

  /*
   * Если путь содержит /@x/ но не распознан как валидный @x import,
   * значит это вложенный путь
   */
  return /@x\/[\w-]+\//.test(targetPath);
}

function shouldBeFromSlicePublicApi(pathsInfo: PathsInfo) {
  const isFromAnotherSlice = !pathsInfo.isSameSlice;
  return isFromAnotherSlice && !isSlicePublicApi(pathsInfo);
}

function shouldBeFromSegmentsPublicApi(pathsInfo: PathsInfo, validateOptions: ValidateOptions) {
  const needValidateSegments = validateOptions.level === VALIDATION_LEVEL.SEGMENTS;
  return needValidateSegments && !isSegmentsPublicApi(pathsInfo);
}

export function shouldBeFromPublicApi(node: ImportExportNodesWithSourceValue, context: RuleContext, optionsWithDefault: Readonly<Options>): boolean {
  const pathsInfo = extractPathsInfo(node, context);
  const ruleOptions = extractRuleOptions(optionsWithDefault);

  /*
   * Проверка вложенных @x путей (например @x/Session/types).
   * Такие пути должны быть исправлены на @x/Session.
   */
  if (hasNestedCrossImportPath(pathsInfo.normalizedTargetPath)) {
    return true;
  }

  return shouldBeFromSlicePublicApi(pathsInfo) || shouldBeFromSegmentsPublicApi(pathsInfo, ruleOptions);
}
