/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const {
  isPathRelative,
  getLayerSliceFromPath,
  normalizePath,
  getByRegExp,
} = require('../../lib/helpers');
const { layersRegExp, layersMap } = require('../../lib/constants');
const { MESSAGE_ID } = require('./constants');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null,
    docs: {
      description: 'Check for module imports from public api',
      recommended: false,
      url: null,
    },
    hasSuggestions: true,
    fixable: null,
    messages: {
      [MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API]: 'Absolute imports are only allowed from public api ("{{ fixedPath }}")',
      [MESSAGE_ID.REMOVE_SUGGESTION]:  'Remove the "{{ segments }}"',
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
      return publicApiPathWithoutSeparatorAtTheEnd;
    };

    const getSegmentsFromPath = (targetPath) => {
      return getByRegExp(targetPath, segmentsElementsRegExp);
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

        if (!layersMap.has(importLayer) || importLayer === 'app' || importLayer === 'shared') {
          return;
        }

        if (isImportFromPublicApi(importPath)) {
          return;
        }

        const fixedPath = convertToPublicApi(importPath);

        context.report({
          node: node.source,
          messageId: MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
          data: {
            fixedPath,
          },
          suggest: [
            {
              messageId: MESSAGE_ID.REMOVE_SUGGESTION,
              data: {
                segments: getSegmentsFromPath(importPath),
              },
              fix: (fixer) => {
                return fixer.replaceText(node.source, `'${fixedPath}'`);
              },
            },
          ],
        });
      },
    };
  },
};
