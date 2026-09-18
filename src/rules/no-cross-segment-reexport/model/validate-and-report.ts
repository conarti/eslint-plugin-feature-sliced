import type { NormalizedLayerConfig } from '../../../config';
import type { ExportNodesWithSource } from '../../../lib/rule/models';
import type { Options, RuleContext } from '../config';
import { extractSlice } from '../../../lib/feature-sliced/extract-slice';
import { hasPublicApi } from '../../../lib/feature-sliced/has-public-api';
import {
  extractPaths,
  hasPath,
  isIgnoredCurrentFile,
  isIgnoredTarget,
} from '../../../lib/rule';
import { reportCrossSegmentReexport } from './errors';
import { isCrossSegmentReexport } from './is-cross-segment-reexport';

export function validateAndReport(
  node: ExportNodesWithSource,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  config?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
) {
  if (!hasPath(node))
    return;

  const isIgnored = isIgnoredTarget(node, optionsWithDefault)
    || isIgnoredCurrentFile(context, optionsWithDefault);
  if (isIgnored)
    return;

  const {
    normalizedCurrentFilePath,
    absoluteTargetPath,
    normalizedCwd,
  } = extractPaths(node, context);

  /*
   * The shared slice boundary, so this rule stops carrying a definition of its own. Only the
   * current file is resolved: the target is compared part by part against the current file's
   * slice prefix, so no second slice definition enters the comparison.
   */
  const sliceResolution = extractSlice(normalizedCurrentFilePath, config, segmentsConfig, {
    cwd: normalizedCwd,
    hasPublicApi,
  });

  const result = isCrossSegmentReexport(
    normalizedCurrentFilePath,
    absoluteTargetPath,
    config,
    segmentsConfig,
    sliceResolution.boundary,
  );

  if (!result.isCrossSegmentReexport)
    return;

  reportCrossSegmentReexport(
    context,
    node,
    result.currentSegment,
    result.targetSegment,
  );
}
