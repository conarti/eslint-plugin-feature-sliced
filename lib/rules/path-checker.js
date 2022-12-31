/**
 * @fileoverview Checks for absolute and relative paths
 * @author conarti
 */
'use strict';
const path = require('path');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Checks for absolute and relative paths',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options[0]?.alias || null;

    const layers = {
      'shared': 'shared',
      'entities': 'entities',
      'features': 'features',
      'widgets': 'widgets',
      'pages': 'pages',
    };

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const isPathRelative = (path) => {
      return path === '.' || path.startsWith('./') || path.startsWith('../');
    };

    const normalizePath = (targetPath) => path.normalize(targetPath).replace(/\\/g, '/');

    const removeAlias = (targetPath, alias) => {
      if (!alias) {
        return targetPath;
      }
      return targetPath.replace(`${alias}/`, '');
    };

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
          context.report(node, 'There must be relative paths within the same slice');
        }
      },
    };
  },
};
