import { ERROR_MESSAGE_ID } from '../config';

export function reportShouldBeRelative(node, context) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
  });
}

export function reportShouldBeAbsolute(node, context) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
  });
}
