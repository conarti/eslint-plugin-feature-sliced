import type { NormalizedLayerConfig } from '../../../config';
import {
  extractCrossImportInfo,
  extractPathsInfo,
  type PathsInfo,
} from '../../../lib/feature-sliced';
import {
  isCrossImportFileTargetingOwnSlice,
  staysInsideOneSlice,
} from '../../../lib/feature-sliced/slice-containment';
import {
  extractRuleOptions,
  type ImportExportNodesWithSourceValue,
} from '../../../lib/rule';
import {
  type Options,
  type RuleContext,
  VALIDATION_LEVEL,
  type ValidationLevel,
} from '../config';
import { isSegmentsPublicApi } from './is-segments-public-api';
import { isSlicePublicApi } from './is-slice-public-api';

interface ValidateOptions { level: ValidationLevel };

/**
 * Checks if @x path is nested (invalid).
 * Valid: @x/Session, @x/Session.ts
 * Invalid: @x/Session/types, @x/Session/model/hooks
 */
function hasNestedCrossImportPath(targetPath: string): boolean {
  const crossImportInfo = extractCrossImportInfo(targetPath);

  if (crossImportInfo.isCrossImport) {
    return false;
  }

  /*
   * If path contains /@x/ but not recognized as valid @x import,
   * it means this is a nested path
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

export function shouldBeFromPublicApi(
  node: ImportExportNodesWithSourceValue,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  layersConfig?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
): boolean {
  const pathsInfo = extractPathsInfo(node, context, { layersConfig, segmentsConfig });
  const ruleOptions = extractRuleOptions(optionsWithDefault);

  /*
   * Check for nested @x paths (e.g., @x/Session/types).
   * Such paths should be fixed to @x/Session.
   */
  if (hasNestedCrossImportPath(pathsInfo.normalizedTargetPath)) {
    return true;
  }

  /*
   * An @x file is the cross-import public api of its own slice,
   * so it may reach that slice without going through the public api.
   */
  if (isCrossImportFileTargetingOwnSlice(pathsInfo.normalizedCurrentFilePath, pathsInfo.absoluteTargetPath, layersConfig)) {
    return false;
  }

  /*
   * An import that never leaves the slice it starts in does not go through the
   * public api of that slice, so it must not be asked for one.
   */
  if (staysInsideOneSlice(
    { path: pathsInfo.normalizedCurrentFilePath, slice: pathsInfo.fsdPartsOfCurrentFile.slice },
    { path: pathsInfo.absoluteTargetPath, slice: pathsInfo.fsdPartsOfTarget.slice },
    layersConfig,
  )) {
    return false;
  }

  return shouldBeFromSlicePublicApi(pathsInfo) || shouldBeFromSegmentsPublicApi(pathsInfo, ruleOptions);
}
