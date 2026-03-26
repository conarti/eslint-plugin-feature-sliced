import type { TSESTree } from '@typescript-eslint/utils';
import type { NormalizedLayerConfig } from '../../../config';
import { extractPathsInfo } from '../../../lib/feature-sliced';
import {
  getSourceRangeWithoutQuotes,
  type ImportExportNodesWithSourceValue,
} from '../../../lib/rule';
import {
  MESSAGE_ID,
  type RuleContext,
} from '../config';
import { convertToPublicApi } from './convert-to-public-api';

export function reportShouldBeFromPublicApi(
  node: ImportExportNodesWithSourceValue,
  context: RuleContext,
  layersConfig?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
) {
  const pathsInfo = extractPathsInfo(node, context, { layersConfig, segmentsConfig });
  const [fixedPath, valueToRemove] = convertToPublicApi(pathsInfo);

  context.report({
    node: node.source,
    messageId: MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
    data: {
      fixedPath,
    },
    suggest: [
      {
        messageId: MESSAGE_ID.REMOVE_SUGGESTION,
        data: {
          valueToRemove,
        },
        fix: (fixer) => fixer.replaceTextRange(getSourceRangeWithoutQuotes(node.source.range), fixedPath),
      },
    ],
  });
}

export function reportUnknownSegment(
  node: ImportExportNodesWithSourceValue,
  context: RuleContext,
  segment: string,
) {
  context.report({
    node: node.source,
    messageId: MESSAGE_ID.UNKNOWN_SEGMENT,
    data: {
      segment,
    },
  });
}

export function reportLayersPublicApiNotAllowed(node: TSESTree.Program, context: RuleContext) {
  context.report({
    node,
    messageId: MESSAGE_ID.LAYERS_PUBLIC_API_NOT_ALLOWED,
  });
}
