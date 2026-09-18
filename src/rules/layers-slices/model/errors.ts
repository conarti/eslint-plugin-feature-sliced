import type { TSESTree } from '@typescript-eslint/utils';
import type { NormalizedLayerConfig } from '../../../config';
import type { CrossImportInfo, PathsInfo } from '../../../lib/feature-sliced';
import type { ImportExportNodesWithSourceValue } from '../../../lib/rule';
import type { ExportNodesWithSource } from '../../../lib/rule/models';
import { getLayerNames } from '../../../lib/feature-sliced/layers-config';
import {
  ERROR_MESSAGE_ID,
  type RuleContext,
} from '../config';

function getReportPosition(node: ImportExportNodesWithSourceValue | TSESTree.ImportClause): TSESTree.Node {
  const isDeclaration = 'source' in node;
  if (isDeclaration) {
    return node.source;
  }

  return node;
}

export function reportCanNotImportLayer(
  context: RuleContext,
  node: ImportExportNodesWithSourceValue | TSESTree.ImportClause,
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

/**
 * A re-export that forwards a lower layer out through this file is a pass-through:
 * the layer order allows the dependency, but the public API of this slice starts
 * carrying another layer's module.
 */
export function reportPassThroughReexport(
  context: RuleContext,
  node: ExportNodesWithSource,
  pathsInfo: PathsInfo,
) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.PASS_THROUGH_REEXPORT,
    data: {
      importLayer: pathsInfo.fsdPartsOfTarget.layer,
      currentFileLayer: pathsInfo.fsdPartsOfCurrentFile.layer,
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
