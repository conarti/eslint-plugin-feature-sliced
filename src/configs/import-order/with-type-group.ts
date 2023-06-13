import { layers } from '../../config';

const LAYERS_REVERSED = [...layers].reverse();

export = {
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
        'newlines-between': 'never',
        pathGroups: LAYERS_REVERSED.map(
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
