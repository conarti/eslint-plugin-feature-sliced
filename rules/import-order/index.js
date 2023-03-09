/**
 * @fileoverview Import sorting
 * @author conarti
 */
'use strict';

const { layersNames } = require('../../lib/constants');
const FS_LAYERS = layersNames.reverse();

module.exports = {
  plugins: [
    'import',
  ],
  rules: {
    'import/order': [
      2,
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        pathGroups: FS_LAYERS.map(
          (layer) => ({
            pattern: `**/?(*)${layer}{,/**}`,
            group: 'internal',
            position: 'after',
          }),
        ),
        distinctGroup: false,
        pathGroupsExcludedImportTypes: ['builtin', 'type'],
        groups: ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index'],
      },
    ],
  },
};
