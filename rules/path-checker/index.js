/**
 * @fileoverview Checks for absolute and relative paths
 * @author conarti
 */
'use strict';

const {
  isPathRelative,
  getLayerSliceFromPath,
  normalizePath,
} = require('../../lib/helpers');
const { errorCodes, layersMap } = require('../../lib/constants');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null,
    docs: {
      description: 'Checks for absolute and relative paths',
      recommended: false,
      url: null,
    },
    fixable: null,
    messages: {
      [errorCodes['path-checker']]: 'There must be relative paths within the same slice',
    },
    schema: [],
  },

  create(context) {
    const shouldBeRelative = (importPath, currentFilePath) => {
      if (isPathRelative(importPath)) {
        return false;
      }

      const [importLayer, importSlice] = getLayerSliceFromPath(importPath);

      if (!importLayer || !importSlice || !layersMap.has(importLayer)) {
        return false;
      }

      const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

      if (!currentFileLayer || !currentFileSlice || !layersMap.has(currentFileLayer)) {
        return false;
      }

      return currentFileSlice === importSlice && currentFileLayer === importLayer;
    };

    return {
      ImportDeclaration(node) {
        const importPath = normalizePath(node.source.value);
        const currentFilePath = normalizePath(context.getFilename());

        if (shouldBeRelative(importPath, currentFilePath)) {
          context.report({
            node,
            messageId: errorCodes['path-checker'],
          });
        }
      },
    };
  },
};
