import type { ImportExportNodesWithSourceValue } from '../../../lib/rule';
import { ERROR_MESSAGE_ID, type RuleContext } from '../config';

export function reportCrossSegmentReexport(
  context: RuleContext,
  node: ImportExportNodesWithSourceValue,
  currentSegment: string,
  targetSegment: string,
) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.NO_CROSS_SEGMENT_REEXPORT,
    data: {
      currentSegment,
      targetSegment,
    },
  });
}
