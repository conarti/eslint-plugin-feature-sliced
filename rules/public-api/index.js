/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const { getSourceRangeWithoutQuotes } = require('../../lib/rule-lib');
const {
  normalizePath,
  convertToAbsolute,
} = require('../../lib/path-lib');
const {
  getLayerSliceFromPath,
  getFsdPartsFromPath,
} = require('../../lib/fsd-lib');
const { layersMap } = require('../../lib/constants');
const {
  MESSAGE_ID,
  IGNORED_LAYERS,
} = require('./constants');
const {
  isImportFromPublicApi,
  convertToPublicApi,
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
      if (node.source === null) {
        return;
      }

      const currentFilePath = normalizePath(context.getFilename());
      const normalizedImportPath = normalizePath(node.source.value);
      const importPath = convertToAbsolute(currentFilePath, normalizedImportPath);

      const [importLayer, importSlice] = getLayerSliceFromPath(importPath);
      const [, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

      const isImportNotFromFsdLayer = !layersMap.has(importLayer);
      const isImportFromIgnoredLayer = IGNORED_LAYERS.has(importLayer);

      if (isImportNotFromFsdLayer || isImportFromIgnoredLayer) {
        return;
      }

      /** @duplicate getLayerSliceFromPath - можно убрать функцию и использовать эту */
      const importPathFsdParts = getFsdPartsFromPath(importPath);
      const currentFilePathFsdParts = getFsdPartsFromPath(currentFilePath);

      const isImportFromSameSlice = importSlice === currentFileSlice;
      const isImportFromSameSegment = importPathFsdParts.segment === currentFilePathFsdParts.segment;

      if (isImportFromPublicApi({
        segmentFiles: importPathFsdParts.segmentFiles,
        segment: importPathFsdParts.segment,
        isImportFromSameSlice,
        isImportFromSameSegment,
      })) {
        return;
      }

      const [fixedPath, valueToRemove] = convertToPublicApi({
        targetPath: normalizedImportPath,
        segment: importPathFsdParts.segment,
        segmentFiles: importPathFsdParts.segmentFiles,
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
      ImportExpression(node) {
        validateAndReport(node);
      },
      ExportAllDeclaration(node) {
        validateAndReport(node);
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node);
      },
    };
  },
};
