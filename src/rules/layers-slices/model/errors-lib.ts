import {
  ERROR_MESSAGE_ID,
  type RuleContext,
} from '../config';
import { type ImportExportNodesWithSourceValue } from '../../../lib/rule-lib';
import { type PathsInfo } from '../../../lib/fsd-lib';

export function reportCanNotImportLayer(context: RuleContext, node: ImportExportNodesWithSourceValue, pathsInfo: PathsInfo) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.importLayer,
      currentFileLayer: pathsInfo.currentFileLayer,
    },
  });
}
