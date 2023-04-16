/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const {
  getLayerSliceFromPath,
  normalizePath,
  convertToAbsolute,
  getSourceRangeWithoutQuotes,
} = require('../../lib/helpers');
const { layersMap } = require('../../lib/constants');
const {
  MESSAGE_ID,
  IGNORED_LAYERS,
} = require('./constants');
const {
  isImportFromPublicApi,
  convertToPublicApi,
  getFsdPartsFromPath,
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
      [MESSAGE_ID.REMOVE_SUGGESTION]: 'Remove the "{{ valueToRemove }}"',
    },
    schema: [],
  },

  create(context) {
    const validateAndReport = (node) => {
      const currentFilePath = normalizePath(context.getFilename());
      const normalizedImportPath = normalizePath(node.source.value);
      const importPath = convertToAbsolute(currentFilePath, normalizedImportPath);

      const [importLayer, importSlice] = getLayerSliceFromPath(importPath);
      const [, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

      const isImportNotFromFsdLayer = !layersMap.has(importLayer);
      const isImportFromIgnoredLayer = IGNORED_LAYERS.has(importLayer);
      const isImportFromSameSlice = importSlice === currentFileSlice;

      if (isImportNotFromFsdLayer || isImportFromIgnoredLayer) {
        return;
      }

      const pathFsdParts = getFsdPartsFromPath(importPath);

      if (isImportFromPublicApi({
        segmentFiles: pathFsdParts.segmentFiles,
        segment: pathFsdParts.segment,
        isImportFromSameSlice,
      })) {
        return;
      }

      const [fixedPath, valueToRemove] = convertToPublicApi({
        targetPath: normalizedImportPath,
        segment: pathFsdParts.segment,
        segmentFiles: pathFsdParts.segmentFiles,
        isImportFromSameSlice,
      });

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
    };

    return {
      ImportDeclaration(node) {
        validateAndReport(node);
      },
    };
  },
};
