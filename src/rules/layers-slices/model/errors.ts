import {
  type TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/utils';
import { type PathsInfo } from '../../../lib/feature-sliced';
import { type ImportExportNodesWithSourceValue } from '../../../lib/rule';
import {
  ERROR_MESSAGE_ID,
  type RuleContext,
} from '../config';

export function reportCanNotImportLayer(
  context: RuleContext,
  node: ImportExportNodesWithSourceValue | TSESTree.ImportSpecifier,
  pathsInfo: PathsInfo,
) {
  function getReportPosition(validatedNode: ImportExportNodesWithSourceValue | TSESTree.ImportSpecifier): TSESTree.Node {
    const isSpecifier = validatedNode.type === AST_NODE_TYPES.ImportSpecifier;
    if (isSpecifier) {
      return validatedNode;
    }

    return validatedNode.source;
  }

  context.report({
    node: getReportPosition(node),
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.fsdPartsOfTarget.layer,
      currentFileLayer: pathsInfo.fsdPartsOfCurrentFile.layer,
    },
  });
}
