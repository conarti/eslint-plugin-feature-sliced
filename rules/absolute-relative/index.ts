import { validateAndReport } from './model';
import { createRule } from '../../lib/rule-lib';
import type {
  MessageIds,
  Options,
} from './config';
import { ERROR_MESSAGE_ID } from './config';

export default createRule<Options, MessageIds>({
  name: 'absolute-relative',
  meta: {
    type: 'problem',
    docs: {
      description: 'Checks for absolute and relative paths',
      recommended: false,
    },
    messages: {
      [ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH]: 'There must be relative paths',
      [ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH]: 'There must be absolute paths',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreInFilesPatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
  },
  defaultOptions: [
    {
      ignoreInFilesPatterns: [],
    },
  ],

  create(context) {
    return {
      ImportDeclaration(node) {
        validateAndReport(node, context);
      },
      ImportExpression(node) {
        validateAndReport(node, context);
      },
      ExportAllDeclaration(node) {
        validateAndReport(node, context, { needCheckForAbsolute: false });
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node, context, { needCheckForAbsolute: false });
      },
    };
  },
});
