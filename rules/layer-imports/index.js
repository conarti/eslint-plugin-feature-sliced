/**
 * @fileoverview Checks layer imports
 * @author conarti
 */
'use strict';

const { getAliasFromOptions, normalizePath, isPathRelative, getLayerSliceFromPath } = require('../../lib/helpers');
const { layers, errorCodes } = require('../../lib/constants');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Checks layer imports',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    messages: {
      [errorCodes['layer-imports']]: 'A layer can only import underlying layers into itself (shared, entities, features, widgets, pages, app)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = getAliasFromOptions(context);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const canNotImportLayer = (importLayer, currentFileLayer, layerOrder) => {
      const importLayerOrder = layerOrder[importLayer];
      const currentFileLayerOrder = layerOrder[currentFileLayer];

      return currentFileLayerOrder < importLayerOrder;
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const importPath = normalizePath(node.source.value, alias);

        if (isPathRelative(importPath)) {
          return;
        }

        const currentFilePath = normalizePath(context.getFilename(), alias);
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
