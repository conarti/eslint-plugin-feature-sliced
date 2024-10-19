import type { TypedFlatConfigItem } from '../../config';
import {
  LAYERS_REVERSED,
  plugins,
} from './shared';

export const withNewlines = {
  name: '@conarti/sort-imports/with-newlines',
  plugins,
  rules: {
    'import/order': [
      2,
      {
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        'pathGroups': LAYERS_REVERSED.map(
          (layer) => ({
            pattern: `**/?(*)${layer}{,/**}`,
            group: 'internal',
            position: 'after',
          }),
        ),
        'distinctGroup': false,
        'pathGroupsExcludedImportTypes': ['builtin'],
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
  },
} satisfies TypedFlatConfigItem;
