/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const { getAliasFromOptions, isPathRelative, normalizePath, getPathParts } = require('../helpers');
const { layers, errorCodes, pathSeparator } = require('../constants');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null,
    docs: {
      description: 'Check for module imports from public api',
      recommended: false,
      url: null,
    },
    fixable: 'code',
    messages: {
      [errorCodes['public-api-imports']]: 'Absolute imports are only allowed from public api (index.ts)',
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

    const isImportNotFromPublicApi = (importPath) => {
      const pathPartsLength = importPath.split(pathSeparator).length;
      return pathPartsLength > 2;
    };

    const convertToPublicApi = ({ fixer, node, layer, slice, alias }) => {
      const resultPath = `${layer}/${slice}`;
      return fixer.replaceText(node.source, alias ? `'${alias}/${resultPath}'` : `'${resultPath}'`);
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

        const [layer, slice] = getPathParts(importPath);

        if (!layers[layer]) {
          return;
        }

        if (isImportNotFromPublicApi(importPath)) {
          context.report({
            node,
            messageId: errorCodes['public-api-imports'],
            fix: (fixer) => convertToPublicApi({ fixer, node, layer, slice, alias }),
          });
        }
      },
    };
  },
};
