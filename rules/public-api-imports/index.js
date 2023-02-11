/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const {
  isPathRelative,
  normalizePath,
  getLayerSliceFromPath,
  getAlias,
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
    schema: [],
  },

  create(context) {
    const isImportFromPublicApi = (importPath) => {
      const pathPartsLength = importPath.split(pathSeparator).length;
      return pathPartsLength <= 2;
    };

    const convertToPublicApi = ({ layer, slice, alias }) => {
      const resultPath = `${layer}/${slice}`;

      if (alias) {
        return `'${alias}/${resultPath}'`;
      }

      return `'${resultPath}'`;
    };

    const isImportFromSameSlice = (importSlice, currentFileSlice) => importSlice === currentFileSlice;

    return {
      ImportDeclaration(node) {
        const importPath = normalizePath(node.source.value);
        const currentFilePath = normalizePath(context.getFilename());
        const alias = getAlias(node.source.value);

        const [importLayer, importSlice] = getLayerSliceFromPath(importPath);
        const [, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

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
