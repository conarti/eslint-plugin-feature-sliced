/**
 * @fileoverview Checks layer imports
 * @author conarti
 */
'use strict';

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
    schema: [],
  },

  create(context) {
    const canImportLayer = (importLayer, currentFileLayer, layersMap) => {
      if (importLayer === 'shared' && currentFileLayer === 'shared') {
        return true;
      }

      const importLayerOrder = layersMap.get(importLayer);
      const currentFileLayerOrder = layersMap.get(currentFileLayer);

      return currentFileLayerOrder > importLayerOrder;
    };

    return {
      ImportDeclaration(node) {
        const importPath = normalizePath(node.source.value);

        if (isPathRelative(importPath)) {
          return;
        }

        const currentFilePath = normalizePath(context.getFilename());
        const [importLayer] = getLayerSliceFromPath(importPath);
        const [currentFileLayer] = getLayerSliceFromPath(currentFilePath);

        if (!layersMap.has(importLayer) || !layersMap.has(currentFileLayer)) {
          return;
        }

        if (canImportLayer(importLayer, currentFileLayer, layersMap)) {
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
