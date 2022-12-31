/**
 * @fileoverview Checks for absolute and relative paths
 * @author conarti
 */
'use strict';
const { isPathRelative, getAliasFromOptions, getPathParts, removeAlias, normalizePath } = require('../helpers');
const { errorMessages, layers } = require('../constants');

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
      const normalizedImportPath = normalizePath(importPath);

      if (isPathRelative(normalizedImportPath)) {
        return false;
      }

      const [importLayer, importSlice] = getPathParts(normalizedImportPath);

      if (!importLayer || !importSlice || !layers[importLayer]) {
        return false;
      }

      const normalizedCurrentFilePath = normalizePath(currentFilePath);

      const [currentFileLayer, currentFileSlice] = getPathParts(normalizedCurrentFilePath);

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
        const importPath = removeAlias(node.source.value, alias);
        const currentFilePath = removeAlias(context.getFilename(), alias);

        if (shouldBeRelative(importPath, currentFilePath)) {
          context.report(node, errorMessages['path-checker']);
        }
      },
    };
  },
};
