/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const { getAliasFromOptions, removeAlias, isPathRelative } = require('../helpers');
const { layers, errorMessages } = require('../constants');

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

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const importTo = removeAlias(node.source.value, alias);

        if (isPathRelative(importTo)) {
          return;
        }

        const pathParts = importTo.split('/');
        const [layer] = pathParts;

        if (!layers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = pathParts.length > 2;

        if (isImportNotFromPublicApi) {
          context.report(node, errorMessages['public-api-imports']);
        }
      },
    };
  },
};
