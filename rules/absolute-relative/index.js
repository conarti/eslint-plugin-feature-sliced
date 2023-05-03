/**
 * @fileoverview Checks for absolute and relative paths
 * @author conarti
 */
'use strict';

const micromatch = require('micromatch');
const {
  isPathRelative,
  getLayerSliceFromPath,
  normalizePath,
} = require('../../lib/helpers');
const { ERROR_MESSAGE_ID } = require('./constants');
const {
  shouldBeRelative,
  shouldBeAbsolute,
} = require('./model');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Checks for absolute and relative paths',
      recommended: false,
      url: null,
    },
    fixable: null,
    messages: {
      [ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH]: 'There must be relative paths',
      [ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH]: 'There must be absolute paths',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreInFilesPatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
  },

  create(context) {
    const ruleOptions = context.options[0] || {};
    const { ignoreInFilesPatterns } = ruleOptions;

    const getPathsInfo = (node, context) => {
      const importPath = normalizePath(node.source.value);
      const currentFilePath = normalizePath(context.getFilename());

      const [targetLayer, targetSlice] = getLayerSliceFromPath(importPath);
      const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(currentFilePath);
      const isImportRelative = isPathRelative(importPath);

      return {
        isImportRelative,
        targetLayer,
        targetSlice,
        currentFilePath,
        currentFileLayer,
        currentFileSlice,
      };
    };

    const validateAndReport = (node, options = {}) => {
      const { needCheckForAbsolute = true } = options;

      if (node.source === null) {
        return;
      }

      const pathsInfo = getPathsInfo(node, context);

      if (ignoreInFilesPatterns && micromatch.isMatch(pathsInfo.currentFilePath, ignoreInFilesPatterns)) {
        return;
      }

      if (shouldBeRelative(pathsInfo)) {
        context.report({
          node: node.source,
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        });
      }

      if (needCheckForAbsolute && shouldBeAbsolute(pathsInfo)) {
        context.report({
          node: node.source,
          messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
        });
      }
    };

    return {
      ImportDeclaration(node) {
        validateAndReport(node);
      },
      ImportExpression(node) {
        validateAndReport(node);
      },
      ExportAllDeclaration(node) {
        validateAndReport(node, { needCheckForAbsolute: false });
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node, { needCheckForAbsolute: false });
      },
    };
  },
};
