/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const {
  getAliasFromOptions,
  isPathRelative,
  normalizePath,
  getPathParts,
} = require('../../lib/helpers');
const { layers, errorCodes, pathSeparator } = require('../../lib/constants');

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

    const isImportFromSameSlice = (importSlice, currentFileSlice) => importSlice === currentFileSlice;

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const importPath = normalizePath(node.source.value, alias);
        const currentFilePath = normalizePath(context.getFilename(), alias);

        const [importLayer, importSlice] = getPathParts(importPath);
        const [, currentFileSlice] = getPathParts(currentFilePath);

        if (isPathRelative(importPath) || isImportFromSameSlice(importSlice, currentFileSlice)) {
          return;
        }

        if (!layers[importLayer] || importLayer === 'app') {
          return;
        }

        if (isImportNotFromPublicApi(importPath)) {
          context.report({
            node,
            messageId: errorCodes['public-api-imports'],
            fix: (fixer) => convertToPublicApi({ fixer, node, layer: importLayer, slice: importSlice, alias }),
          });
        }
      },
    };
  },
};
