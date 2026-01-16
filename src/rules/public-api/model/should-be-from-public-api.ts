import type { NormalizedLayerConfig } from '../../../config';
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
): boolean {
  const pathsInfo = extractPathsInfo(node, context, { layersConfig });
  const ruleOptions = extractRuleOptions(optionsWithDefault);

  /*
   * Check for nested @x paths (e.g., @x/Session/types).
   * Such paths should be fixed to @x/Session.
   */
  if (hasNestedCrossImportPath(pathsInfo.normalizedTargetPath)) {
    return true;
  }

  return shouldBeFromSlicePublicApi(pathsInfo) || shouldBeFromSegmentsPublicApi(pathsInfo, ruleOptions);
}
