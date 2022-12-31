/**
 * @fileoverview Checks for absolute and relative paths
 * @author conarti
 */
'use strict';
const { isPathRelative, getAliasFromOptions, removeAlias, normalizePath } = require('../helpers');
const { errorMessages, layers } = require('../constants');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null,
    docs: {
      description: 'Checks for absolute and relative paths',
      recommended: false,
      url: null,
    },
    fixable: null,
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

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const shouldBeRelative = (from, to) => {
      const normalizedPathTo = normalizePath(to);

      if (isPathRelative(normalizedPathTo)) {
        return false;
      }

      const [toLayer, toSlice] = to.split('/');

      if (!toLayer || !toSlice || !layers[toLayer]) {
        return false;
      }

      const normalizedPathFrom = normalizePath(from);
      const [, projectFrom] = normalizedPathFrom.split('src');
      const [, fromLayer, fromSlice] = projectFrom.split('/');

      if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
      }

      return fromSlice === toSlice && fromLayer === toLayer;
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const importTo = removeAlias(node.source.value, alias);
        const fromFilename = removeAlias(context.getFilename(), alias);

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report(node, errorMessages['path-checker']);
        }
      },
    };
  },
};
