import { type TSESTree } from '@typescript-eslint/utils';
import { type PathsInfo } from '../../../lib/feature-sliced';
import { type ImportExportNodesWithSourceValue } from '../../../lib/rule';
import {
  ERROR_MESSAGE_ID,
  type RuleContext,
} from '../config';

export function reportCanNotImportLayer(context: RuleContext, node: ImportExportNodesWithSourceValue, pathsInfo: PathsInfo) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.fsdPartsOfTarget.layer,
      currentFileLayer: pathsInfo.fsdPartsOfCurrentFile.layer,
    },
  });
}

export function reportCanNotImportLayerAtSpecifier(context: RuleContext, node: TSESTree.ImportSpecifier, pathsInfo: PathsInfo) {
  context.report({
    node,
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.fsdPartsOfTarget.layer,
      currentFileLayer: pathsInfo.fsdPartsOfCurrentFile.layer,
    },
  });
}
