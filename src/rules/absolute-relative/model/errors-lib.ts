import { type ImportExportNodesWithSourceValue } from '../../../lib/rule-lib';
import {
  ERROR_MESSAGE_ID,
  type RuleContext,
} from '../config';

export function reportShouldBeRelative(node: ImportExportNodesWithSourceValue, context: RuleContext) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
  });
}

export function reportShouldBeAbsolute(node: ImportExportNodesWithSourceValue, context: RuleContext) {
  /* TODO: add suggestion fix using cwd, tsconfig/vite/webpack alias */
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
  });
}
