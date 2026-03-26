import type {
  MessageIds,
  Options,
} from './config';
import {
  createEslintRule,
  extractLayersConfig,
  extractSegmentsConfig,
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
      [ERROR_MESSAGE_ID.CAN_NOT_IMPORT]: 'You cannot import layer "{{ importLayer }}" into "{{ currentFileLayer }}" ({{ layersOrder }})',
      [ERROR_MESSAGE_ID.INVALID_CROSS_IMPORT]: 'Cross-import "{{ sourceSlice }}/@x/{{ targetSlice }}" is only allowed from slice "{{ targetSlice }}"',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowTypeImports: {
            type: 'boolean',
          },
          ignoreImports: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          ignoreFiles: {
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
      ignoreImports: [],
      ignoreFiles: [],
    },
  ],

  create(context, optionsWithDefault) {
    const layersConfig = extractLayersConfig(context);
    const segmentsConfig = extractSegmentsConfig(context);

    return {
      ImportDeclaration(node) {
        validateAndReport(node, context, optionsWithDefault, layersConfig, segmentsConfig);
      },
      ImportExpression(node) {
        validateAndReport(node as ImportExpression /* TSESTree has invalid type for this node */, context, optionsWithDefault, layersConfig, segmentsConfig);
      },
    };
  },
});
