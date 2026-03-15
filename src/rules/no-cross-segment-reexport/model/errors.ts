import type { ImportExportNodesWithSourceValue } from '../../../lib/rule';
import { getSourceRangeWithoutQuotes } from '../../../lib/rule';
import { ERROR_MESSAGE_ID, type RuleContext } from '../config';

/**
 * Builds the suggested import path for the slice public API.
 *
 * Replaces the sibling segment reference (e.g. `../api`) with a relative path
 * to the slice root (e.g. `..`), which is the slice public API.
 *
 * @example
 * ```
 * // from: src/entities/cluster/model/index.ts
 * // source: '../api'
 * // result: '..'
 *
 * // from: src/entities/cluster/model/store/index.ts
 * // source: '../../api'
 * // result: '../..'
 * ```
 */
export function buildSlicePublicApiPath(sourcePath: string, targetSegment: string): string {
  const parts = sourcePath.split('/');

  /* Find and remove the target segment from the path */
  const segmentIndex = parts.findIndex((part) => part === targetSegment);

  if (segmentIndex !== -1) {
    /* Remove the segment and everything after it */
    return parts.slice(0, segmentIndex).join('/');
  }

  /* Fallback: replace last part with nothing (go one level up) */
  return parts.slice(0, -1).join('/') || '..';
}

export function reportCrossSegmentReexport(
  context: RuleContext,
  node: ImportExportNodesWithSourceValue,
  currentSegment: string,
  targetSegment: string,
) {
  const sourcePath = node.source.value;
  const suggestedPath = buildSlicePublicApiPath(sourcePath, targetSegment);

  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.NO_CROSS_SEGMENT_REEXPORT,
    data: {
      currentSegment,
      targetSegment,
    },
    suggest: [
      {
        messageId: ERROR_MESSAGE_ID.MOVE_TO_SLICE_PUBLIC_API_SUGGESTION,
        data: {
          suggestedPath,
        },
        fix: (fixer) => fixer.replaceTextRange(
          getSourceRangeWithoutQuotes(node.source.range),
          suggestedPath,
        ),
      },
    ],
  });
}
