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
const { layers, errorCodes } = require('../../lib/constants');

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
      [errorCodes['layer-imports']]: 'A layer can only import underlying layers into itself (shared, entities, features, widgets, pages, app)',
    },
    schema: [],
  },

  create(context) {
    const canNotImportLayer = (importLayer, currentFileLayer, layerOrder) => {
      const importLayerOrder = layerOrder[importLayer];
      const currentFileLayerOrder = layerOrder[currentFileLayer];

      return currentFileLayerOrder < importLayerOrder;
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

        if (!layers[importLayer] || !layers[currentFileLayer]) {
          return;
        }

        if (canNotImportLayer(importLayer, currentFileLayer, layers)) {
          context.report({
            node,
            messageId: errorCodes['layer-imports'],
          });
        }
      },
    };
  },
};
