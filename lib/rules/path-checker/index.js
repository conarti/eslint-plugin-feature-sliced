/**
 * @fileoverview Checks for absolute and relative paths
 * @author conarti
 */
'use strict';

const {
  isPathRelative,
  getAliasFromOptions,
  getPathParts,
  normalizePath,
} = require('../../helpers');
const { errorCodes, layers } = require('../../constants');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

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
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
        },
      },
    ],
  },

  create(context) {
    const alias = getAliasFromOptions(context);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const shouldBeRelative = (importPath, currentFilePath) => {
      if (isPathRelative(importPath)) {
        return false;
      }

      const [importLayer, importSlice] = getPathParts(importPath);

      if (!importLayer || !importSlice || !layers[importLayer]) {
        return false;
      }

      const [currentFileLayer, currentFileSlice] = getPathParts(currentFilePath);

      if (!currentFileLayer || !currentFileSlice || !layers[currentFileLayer]) {
        return false;
      }

      return currentFileSlice === importSlice && currentFileLayer === importLayer;
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const importPath = normalizePath(node.source.value, alias);
        const currentFilePath = normalizePath(context.getFilename(), alias);

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
