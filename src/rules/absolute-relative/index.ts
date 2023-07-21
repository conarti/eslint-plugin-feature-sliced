import {
  createRule,
  type ImportExpression,
} from '../../lib/rule';
import type {
  MessageIds,
  Options,
} from './config';
import { ERROR_MESSAGE_ID } from './config';
import { validateAndReport } from './model';

export default createRule<Options, MessageIds>({
  name: 'absolute-relative',
  meta: {
    type: 'problem',
    docs: {
      description: 'Checks for absolute and relative paths',
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

  create(context, optionsWithDefault) {
    return {
      ImportDeclaration(node) {
        validateAndReport(node, context, optionsWithDefault);
      },
      ImportExpression(node) {
        validateAndReport(node as ImportExpression /* TSESTree has invalid type for this node */, context, optionsWithDefault);
      },
      ExportAllDeclaration(node) {
        validateAndReport(node, context, optionsWithDefault, { needCheckForAbsolute: false });
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node, context, optionsWithDefault, { needCheckForAbsolute: false });
      },
    };
  },
});
