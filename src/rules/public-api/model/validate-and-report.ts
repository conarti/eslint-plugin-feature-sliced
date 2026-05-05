import type { NormalizedLayerConfig } from '../../../config';
import type {
  Options,
  RuleContext,
} from '../config';
import {
  hasPath,
  type ImportExportNodes,
  isIgnoredCurrentFile,
  isIgnoredTarget,
} from '../../../lib/rule';
import { reportShouldBeFromPublicApi, reportUnknownSegment } from './errors';
import { isUnknownSegment } from './is-unknown-segment';
import { shouldBeFromPublicApi } from './should-be-from-public-api';

export function validateAndReport(
  node: ImportExportNodes,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  layersConfig?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
) {
  if (!hasPath(node)) {
    return;
  }

  const isIgnoredForValidation = isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault);
  if (isIgnoredForValidation) {
    return;
  }

  const unknownSegment = isUnknownSegment(node, context, optionsWithDefault, layersConfig, segmentsConfig);
  if (unknownSegment) {
    reportUnknownSegment(node, context, unknownSegment);
    return;
  }

  if (shouldBeFromPublicApi(node, context, optionsWithDefault, layersConfig, segmentsConfig)) {
    reportShouldBeFromPublicApi(node, context, layersConfig, segmentsConfig);
  }
}
