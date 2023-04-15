/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const {
  getLayerSliceFromPath,
  normalizePath,
  convertToAbsolute,
} = require('../../lib/helpers');
const { layersMap } = require('../../lib/constants');
const {
  MESSAGE_ID,
  IGNORED_LAYERS,
} = require('./constants');
const {
  isImportFromPublicApi,
  convertToPublicApi,
  getSegmentsFromPath,
  isImportFromSameSlice,
} = require('./model');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check for module imports from public api',
      recommended: false,
      url: null,
    },
    hasSuggestions: true,
    fixable: null,
    messages: {
      [MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API]: 'Absolute imports are only allowed from public api ("{{ fixedPath }}")',
      [MESSAGE_ID.REMOVE_SUGGESTION]:  'Remove the "{{ segments }}"',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const currentFilePath = normalizePath(context.getFilename());
        const normalizedImportPath = normalizePath(node.source.value);
        const importPath = convertToAbsolute(currentFilePath, normalizedImportPath);

        const [importLayer, importSlice] = getLayerSliceFromPath(importPath);
        const [, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

        if (isImportFromSameSlice(importSlice, currentFileSlice)) {
          return;
        }

        const isImportNotFromFsdLayer = !layersMap.has(importLayer);
        const isImportFromIgnoredLayer = IGNORED_LAYERS.has(importLayer);

        if (isImportNotFromFsdLayer || isImportFromIgnoredLayer) {
          return;
        }

        if (isImportFromPublicApi(importPath)) {
          return;
        }

        const fixedPath = convertToPublicApi(importPath);

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
                segments: getSegmentsFromPath(importPath),
              },
              fix: (fixer) => {
                return fixer.replaceText(node.source, `'${fixedPath}'`);
              },
            },
          ],
        });
      },
    };
  },
};
