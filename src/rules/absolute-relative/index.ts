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
      ignoreImports: [],
      ignoreFiles: [],
    },
  ],

  create(context, optionsWithDefault) {
    const layersConfig = extractLayersConfig(context);
    const segmentsConfig = extractSegmentsConfig(context);

    return {
      ImportDeclaration(node) {
        validateAndReport(node, context, optionsWithDefault, { needCheckForAbsolute: true }, layersConfig, segmentsConfig);
      },
      ImportExpression(node) {
        validateAndReport(node as ImportExpression /* TSESTree has invalid type for this node */, context, optionsWithDefault, { needCheckForAbsolute: true }, layersConfig, segmentsConfig);
      },
      ExportAllDeclaration(node) {
        validateAndReport(node, context, optionsWithDefault, { needCheckForAbsolute: false }, layersConfig, segmentsConfig);
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node, context, optionsWithDefault, { needCheckForAbsolute: false }, layersConfig, segmentsConfig);
      },
    };
  },
});
