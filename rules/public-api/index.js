/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

const { MESSAGE_ID } = require('./constants');
const { validateAndReport } = require('./model');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check for module imports from public api',
      recommended: false,
      url: null,
    },
    /* it doesn't understand when context.report is not in this module */
    // eslint-disable-next-line eslint-plugin/require-meta-has-suggestions
    hasSuggestions: true,
    fixable: null,
    messages: {
      [MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API]: 'Absolute imports are only allowed from public api ("{{ fixedPath }}")',
      [MESSAGE_ID.REMOVE_SUGGESTION]: 'Remove the "{{ valueToRemove }}"',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        validateAndReport(node, context);
      },
      ImportExpression(node) {
        validateAndReport(node, context);
      },
      ExportAllDeclaration(node) {
        validateAndReport(node, context);
      },
      ExportNamedDeclaration(node) {
        validateAndReport(node, context);
      },
    };
  },
};
