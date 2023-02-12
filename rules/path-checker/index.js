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
      [ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH]: 'There must be absolute paths',
    },
    schema: [],
  },

  create(context) {
    const shouldBeRelative = (importPath, currentFilePath) => {
      if (isPathRelative(importPath)) {
        return false;
      }

      const [importLayer, importSlice] = getLayerSliceFromPath(importPath);

      if (!importLayer || !importSlice) {
        return false;
      }

      const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

      if (!currentFileLayer || !currentFileSlice) {
        return false;
      }

      return currentFileSlice === importSlice && currentFileLayer === importLayer;
    };

    const shouldBeAbsolute = (importPath, currentFilePath) => {
      if (!isPathRelative(importPath)) {
        return false;
      }

      const [importLayer] = getLayerSliceFromPath(importPath);

      if (!importLayer) {
        return false;
      }

      const [currentFileLayer] = getLayerSliceFromPath(currentFilePath);

      if (!currentFileLayer) {
        return false;
      }

      return currentFileLayer !== importLayer;
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

        if (shouldBeAbsolute(importPath, currentFilePath)) {
          context.report({
            node,
            messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
          });
        }
      },
    };
  },
};
