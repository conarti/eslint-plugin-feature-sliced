import type { TypedFlatConfigItem } from '../../config';
import {
  LAYERS_REVERSED,
  plugins,
} from './shared';

export const withNewlinesAndTypeGroup = {
  name: '@conarti/sort-imports/with-newlines-and-type-group',
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
        'pathGroupsExcludedImportTypes': ['builtin', 'type'],
        'groups': ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index'],
      },
    ],
  },
} satisfies TypedFlatConfigItem;
