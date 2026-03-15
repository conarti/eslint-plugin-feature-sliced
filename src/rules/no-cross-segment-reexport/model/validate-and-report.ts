import type { NormalizedLayerConfig } from '../../../config';
import type { ExportNodesWithSource } from '../../../lib/rule/models';
import type { Options, RuleContext } from '../config';
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
  } = extractPaths(node, context);

  const result = isCrossSegmentReexport(
    normalizedCurrentFilePath,
    absoluteTargetPath,
    config,
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
