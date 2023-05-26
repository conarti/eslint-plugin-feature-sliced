/**
 * @fileoverview Checks for absolute and relative paths
 * @author conarti
 */
'use strict';

const { extractRuleOptions } = require('../../lib/helpers');
const { ERROR_MESSAGE_ID } = require('./constants');
const { validateAndReport } = require('./model');

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
    const ruleOptions = extractRuleOptions(context);

    return {
      ImportDeclaration(node) {
        validateAndReport(node, context, ruleOptions);
      },
      ImportExpression(node) {
        validateAndReport(node, context, ruleOptions);
      },
      ExportAllDeclaration(node) {
        validateAndReport(node, context, ruleOptions, { needCheckForAbsolute: false });
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node, context, ruleOptions, { needCheckForAbsolute: false });
      },
    };
  },
};
