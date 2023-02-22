/**
 * @fileoverview Checks layer imports
 * @author conarti
 */
'use strict';

const micromatch = require('micromatch');
const {
  isPathRelative,
  getLayerSliceFromPath,
  normalizePath,
} = require('../../lib/helpers');
const { layersMap } = require('../../lib/constants');
const { ERROR_MESSAGE_ID } = require('./constants');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null,
    docs: {
      description: 'Checks layer imports',
      recommended: false,
      url: null,
    },
    fixable: null,
    messages: {
      [ERROR_MESSAGE_ID.CAN_NOT_IMPORT]: 'A layer can only import underlying layers into itself (shared, entities, features, widgets, pages, app)',
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
          }
        },
      },
    ],
  },

  create(context) {
    const ruleOptions = context.options[0] || {};
    const {
      allowTypeImports,
      ignorePatterns,
    } = ruleOptions;

    const canImportLayer = (importLayer, currentFileLayer, currentFileSlice, layersMap) => {
      if (!currentFileSlice) {
        return true;
      }

      if (importLayer === 'shared' && currentFileLayer === 'shared') {
        return true;
      }

      const importLayerOrder = layersMap.get(importLayer);
      const currentFileLayerOrder = layersMap.get(currentFileLayer);

      return currentFileLayerOrder > importLayerOrder;
    };

    const isTypeImport = (node) => {
      return node.importKind === 'type';
    };

    return {
      ImportDeclaration(node) {
        if (allowTypeImports && isTypeImport(node)) {
          return;
        }

        const importPath = normalizePath(node.source.value);

        if (ignorePatterns && micromatch.isMatch(importPath, ignorePatterns)) {
          return;
        }

        if (isPathRelative(importPath)) {
          return;
        }

        const currentFilePath = normalizePath(context.getFilename());
        const [importLayer] = getLayerSliceFromPath(importPath);
        const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

        if (!layersMap.has(importLayer) || !layersMap.has(currentFileLayer)) {
          return;
        }

        if (canImportLayer(importLayer, currentFileLayer, currentFileSlice, layersMap)) {
          return;
        }

        context.report({
          node,
          messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
        });
      },
    };
  },
};
