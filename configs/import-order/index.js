/**
 * @fileoverview Import sorting
 * @author conarti
 */
'use strict';

/**
 *  fix cycle errors bug.
 *  TODO: refactor and use from constants again
 */
const FS_LAYERS = [
  'app',
  'processes',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared',
];

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
