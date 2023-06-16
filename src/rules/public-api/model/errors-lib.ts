import { type PathsInfo } from '../../../lib/fsd-lib';
import {
  getSourceRangeWithoutQuotes,
  type ImportExportNodesWithSourceValue,
} from '../../../lib/rule-lib';
import {
  MESSAGE_ID,
  type RuleContext,
} from '../config';
import { convertToPublicApi } from './convert-to-public-api';

export function reportShouldBeFromPublicApi(node: ImportExportNodesWithSourceValue, context: RuleContext, pathsInfo: PathsInfo) {
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
