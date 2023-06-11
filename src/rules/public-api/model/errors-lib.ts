import { MESSAGE_ID } from '../config';
import { getSourceRangeWithoutQuotes } from '../../../lib/rule-lib';
import { convertToPublicApi } from './convert-to-public-api';

export function reportShouldBeFromPublicApi(node, context, pathsInfo) {
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
