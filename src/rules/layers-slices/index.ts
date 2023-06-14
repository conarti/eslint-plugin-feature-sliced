import {
  createRule,
  type ImportExpression,
} from '../../lib/rule-lib';
import type {
  MessageIds,
  Options,
} from './config';
import { ERROR_MESSAGE_ID } from './config';
import { validateAndReport } from './model';

export default createRule<Options, MessageIds>({
  name: 'layers-slices',
  meta: {
    type: 'problem',
    docs: {
      description: 'Checks layer imports',
      recommended: false,
    },
    messages: {
      [ERROR_MESSAGE_ID.CAN_NOT_IMPORT]: 'You cannot import layer "{{ importLayer }}" into "{{ currentFileLayer }}" (shared -> entities -> features -> widgets -> pages -> processes -> app)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowTypeImports: {
            type: 'boolean',
          },
          ignorePatterns: {
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
      allowTypeImports: false, /* TODO: set to 'true' */
      ignorePatterns: [],
    },
  ],

  create(context) {
    return {
      ImportDeclaration(node) {
        validateAndReport(node, context);
      },
      ImportExpression(node) {
        validateAndReport(node as ImportExpression /* TSESTree has invalid type for this node */, context);
      },
    };
  },
});
