import type {
  MessageIds,
  Options,
} from './config';
import {
  createEslintRule,
  type ImportExpression,
} from '../../lib/rule';
import { ERROR_MESSAGE_ID } from './config';
import { validateAndReport } from './model';

export default createEslintRule<Options, MessageIds>({
  name: 'layers-slices',
  meta: {
    type: 'problem',
    docs: {
      description: 'Checks layer imports',
    },
    messages: {
      [ERROR_MESSAGE_ID.CAN_NOT_IMPORT]: 'You cannot import layer "{{ importLayer }}" into "{{ currentFileLayer }}" (shared -> entities -> features -> widgets -> pages -> processes -> app)',
      [ERROR_MESSAGE_ID.INVALID_CROSS_IMPORT]: 'Cross-import "{{ sourceSlice }}/@x/{{ targetSlice }}" is only allowed from slice "{{ targetSlice }}"',
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
      allowTypeImports: true,
      ignorePatterns: [],
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
    };
  },
});
