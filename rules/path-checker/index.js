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
const { layersMap } = require('../../lib/constants');
const { ERROR_MESSAGE_ID } = require('./constants');

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
      [ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH]: 'There must be relative paths within the same slice',
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
            messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
          });
        }
      },
    };
  },
};
