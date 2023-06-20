import {
  createRule,
  type ImportExpression,
} from '../../lib/rule-lib';
import {
  MESSAGE_ID,
  VALIDATION_LEVEL,
  type MessageIds,
  type Options,
} from './config';
import { validateAndReport } from './model';

export default createRule<Options, MessageIds>({
  name: 'public-api',
  meta: {
    type: 'problem',
    docs: {
      description: 'Check for module imports from public api',
      recommended: false,
    },
    /* it doesn't understand when context.report is not in this module */
    // eslint-disable-next-line eslint-plugin/require-meta-has-suggestions
    hasSuggestions: true,
    messages: {
      [MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API]: 'Absolute imports are only allowed from public api ("{{ fixedPath }}")',
      [MESSAGE_ID.REMOVE_SUGGESTION]: 'Remove the "{{ valueToRemove }}"',
      [MESSAGE_ID.LAYERS_PUBLIC_API_NOT_ALLOWED]: 'The layer public API is not allowed. It harms both architecturally and practically (code splitting)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          level: {
            enum: [
              VALIDATION_LEVEL.SEGMENTS,
              VALIDATION_LEVEL.SLICES,
            ],
          },
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
      level: VALIDATION_LEVEL.SLICES,
      ignoreInFilesPatterns: [],
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
      ExportAllDeclaration(node) {
        validateAndReport(node, context);
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node, context);
      },
    };
  },
});
