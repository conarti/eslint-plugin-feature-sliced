import type { NormalizedLayerConfig } from '../../../config';
import type {
  Options,
  RuleContext,
} from '../config';
import { extractCrossImportInfo, extractPathsInfo } from '../../../lib/feature-sliced';
import {
  hasPath,
  type ImportExportNodes,
  isIgnoredCurrentFile,
  isIgnoredTarget,
} from '../../../lib/rule';
import {
  reportShouldBeAbsolute,
  reportShouldBeRelative,
} from './errors';
import { shouldBeAbsolute } from './should-be-absolute';
import { shouldBeRelative } from './should-be-relative';

interface ValidateOptions {
  needCheckForAbsolute: boolean;
};

export function validateAndReport(
  node: ImportExportNodes,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  options: ValidateOptions = { needCheckForAbsolute: true },
  layersConfig?: NormalizedLayerConfig[],
) {
  if (!hasPath(node)) {
    return;
  }

  const isIgnoredForValidation = isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault);
  if (isIgnoredForValidation) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context, { layersConfig });

  /* @x cross-imports are always absolute, skip relative/absolute checks */
  const crossImportInfo = extractCrossImportInfo(pathsInfo.normalizedTargetPath);
  if (crossImportInfo.isCrossImport) {
    return;
  }

  if (shouldBeRelative(pathsInfo)) {
    reportShouldBeRelative(node, context);
  }

  if (options.needCheckForAbsolute && shouldBeAbsolute(pathsInfo)) {
    reportShouldBeAbsolute(node, context);
  }
}
