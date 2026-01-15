import type { NormalizedLayerConfig } from '../../../config';
import type { CrossImportInfo, PathsInfo } from '../../../lib/feature-sliced';
import type { ImportExportNodesWithSourceValue } from '../../../lib/rule';
import {
  AST_NODE_TYPES,
  type TSESTree,
} from '@typescript-eslint/utils';
import { getLayerNames } from '../../../lib/feature-sliced/layers-config';
import {
  ERROR_MESSAGE_ID,
  type RuleContext,
} from '../config';

function getReportPosition(node: ImportExportNodesWithSourceValue | TSESTree.ImportSpecifier): TSESTree.Node {
  const isSpecifier = node.type === AST_NODE_TYPES.ImportSpecifier;
  if (isSpecifier) {
    return node;
  }

  return node.source;
}

export function reportCanNotImportLayer(
  context: RuleContext,
  node: ImportExportNodesWithSourceValue | TSESTree.ImportSpecifier,
  pathsInfo: PathsInfo,
  layersConfig: NormalizedLayerConfig[],
) {
  const layerNames = getLayerNames(layersConfig);

  context.report({
    node: getReportPosition(node),
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.fsdPartsOfTarget.layer,
      currentFileLayer: pathsInfo.fsdPartsOfCurrentFile.layer,
      layersOrder: layerNames.join(' -> '),
    },
  });
}

export function reportInvalidCrossImport(
  context: RuleContext,
  node: ImportExportNodesWithSourceValue,
  crossImportInfo: CrossImportInfo,
) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.INVALID_CROSS_IMPORT,
    data: {
      sourceSlice: crossImportInfo.sourceSlice,
      targetSlice: crossImportInfo.targetSlice,
    },
  });
}
