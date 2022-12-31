/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const { getAliasFromOptions, isPathRelative, normalizePath, getPathParts } = require('../helpers');
const { layers, errorMessages, pathSeparator } = require('../constants');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null,
    docs: {
      description: 'Check for module imports from public api',
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

    const isImportNotFromPublicApi = (importPath) => {
      const pathPartsLength = importPath.split(pathSeparator).length;
      return pathPartsLength > 2;
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

        const [layer] = getPathParts(importPath);

        if (!layers[layer]) {
          return;
        }

        if (isImportNotFromPublicApi(importPath)) {
          context.report(node, errorMessages['public-api-imports']);
        }
      },
    };
  },
};
