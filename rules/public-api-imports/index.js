/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const {
  isPathRelative,
  getLayerSliceFromPath,
  normalizePath,
} = require('../../lib/helpers');
const { layersRegExp, layersMap } = require('../../lib/constants');
const { ERROR_MESSAGE_ID } = require('./constants');

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
      [ERROR_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API]: 'Absolute imports are only allowed from public api (index.ts)',
    },
    schema: [],
  },

  create(context) {
    const segmentsElementsRegExp = new RegExp(`(?<=${layersRegExp.toString().replaceAll('/', '')}\\/\\w*\\/).*`);

    const isImportFromPublicApi = (importPath) => {
      const hasSegments = segmentsElementsRegExp.test(importPath);
      return !hasSegments;
    };

    const convertToPublicApi = (targetPath) => {
      const publicApiPath = targetPath.replace(segmentsElementsRegExp, '');
      const publicApiPathWithoutSeparatorAtTheEnd = publicApiPath.replace(/\/$/, '');
      return `'${publicApiPathWithoutSeparatorAtTheEnd}'`;
    };

    const isImportFromSameSlice = (importSlice, currentFileSlice) => importSlice === currentFileSlice;

    return {
      ImportDeclaration(node) {
        const importPath = normalizePath(node.source.value);
        const currentFilePath = normalizePath(context.getFilename());

        const [importLayer, importSlice] = getLayerSliceFromPath(importPath);
        const [, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

        if (isPathRelative(importPath) || isImportFromSameSlice(importSlice, currentFileSlice)) {
          return;
        }

        if (!layersMap.has(importLayer) || importLayer === 'app') {
          return;
        }

        if (isImportFromPublicApi(importPath)) {
          return;
        }

        context.report({
          node,
          messageId: ERROR_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
          fix: (fixer) => {
            const fixedImportPath = convertToPublicApi(importPath);
            return fixer.replaceText(node.source, fixedImportPath);
          },
        });
      },
    };
  },
};
