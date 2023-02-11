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

    const isImportFromPublicApi = (importPath) => {
      const pathPartsLength = importPath.split(pathSeparator).length;
      return pathPartsLength <= 2;
    };

    const convertToPublicApi = ({ layer, slice, alias }) => {
      const resultPath = `${layer}/${slice}`;
      return alias ? `'${alias}/${resultPath}'` : `'${resultPath}'`;
    };

    const isImportFromSameSlice = (importSlice, currentFileSlice) => importSlice === currentFileSlice;

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

        if (isImportFromPublicApi(importPath)) {
          return;
        }

        context.report({
          node,
          messageId: errorCodes['public-api-imports'],
          fix: (fixer) => {
            const fixedImportPath = convertToPublicApi({ layer: importLayer, slice: importSlice, alias });
            return fixer.replaceText(node.source, fixedImportPath);
          },
        });
      },
    };
  },
};
