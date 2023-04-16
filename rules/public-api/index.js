/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const {
  getLayerSliceFromPath,
  normalizePath,
  convertToAbsolute,
} = require('../../lib/helpers');
const { layersMap } = require('../../lib/constants');
const {
  MESSAGE_ID,
  IGNORED_LAYERS,
} = require('./constants');
const {
  isImportFromPublicApi,
  convertToPublicApi,
} = require('./model');
const { getFsdPartsFromPath } = require('./model/get-fsd-parts-from-path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check for module imports from public api',
      recommended: false,
      url: null,
    },
    hasSuggestions: true,
    fixable: null,
    messages: {
      [MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API]: 'Absolute imports are only allowed from public api ("{{ fixedPath }}")',
      [MESSAGE_ID.REMOVE_SUGGESTION]:  'Remove the "{{ valueToRemove }}"',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const currentFilePath = normalizePath(context.getFilename());
        const normalizedImportPath = normalizePath(node.source.value);
        const importPath = convertToAbsolute(currentFilePath, normalizedImportPath);

        const [importLayer, importSlice] = getLayerSliceFromPath(importPath);
        const [, currentFileSlice] = getLayerSliceFromPath(currentFilePath);

        const isImportNotFromFsdLayer = !layersMap.has(importLayer);
        const isImportFromIgnoredLayer = IGNORED_LAYERS.has(importLayer);

        if (isImportNotFromFsdLayer || isImportFromIgnoredLayer) {
          return;
        }

        if (isImportFromPublicApi({
          importPath,
          /** @duplicate isImportFromSameSlice */
          importSlice,
          currentFileSlice,
        })) {
          return;
        }

        const fixedPath = convertToPublicApi({
          targetPath: normalizedImportPath,
          importPath,
          isFromSameSlice: importSlice === currentFileSlice, /** @duplicate isImportFromSameSlice */
        });

        // TODO refactor this
        const pathFsdParts = getFsdPartsFromPath(importPath);

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
                /** @duplicate части пути для удаления */
                valueToRemove: importSlice === currentFileSlice /** @duplicate isImportFromSameSlice */
                  ? pathFsdParts.segmentFiles
                  : `${pathFsdParts.segment}${pathFsdParts.segmentFiles ? `/${pathFsdParts.segmentFiles}` : ''}`,
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
