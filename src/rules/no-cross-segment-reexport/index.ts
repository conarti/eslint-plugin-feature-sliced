import type { ExportNodesWithSource } from '../../lib/rule/models';
import type { MessageIds, Options } from './config';
import {
  createEslintRule,
  extractLayersConfig,
} from '../../lib/rule';
import { ERROR_MESSAGE_ID } from './config';
import { validateAndReport } from './model';

export default createEslintRule<Options, MessageIds>({
  name: 'no-cross-segment-reexport',
  meta: {
    type: 'problem',
    docs: {
      description: 'Checks for cross-segment re-exports within the same slice',
    },
    messages: {
      [ERROR_MESSAGE_ID.NO_CROSS_SEGMENT_REEXPORT]:
        'Segment "{{ currentSegment }}" should not re-export from sibling segment "{{ targetSegment }}". Move the re-export to the slice public API.',
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

    return {
      ExportAllDeclaration(node) {
        validateAndReport(node, context, optionsWithDefault, layersConfig);
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node as ExportNodesWithSource, context, optionsWithDefault, layersConfig);
      },
    };
  },
});
