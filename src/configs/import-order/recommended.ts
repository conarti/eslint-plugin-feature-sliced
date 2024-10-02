import type { TypedFlatConfigItem } from '../../config';
import { layers } from '../../config';
import { plugins } from './plugins';

const LAYERS_REVERSED = [...layers].reverse();

export const recommended = {
  name: 'import-order-recommended',
  plugins,
  rules: {
    'import/order': [
      2,
      {
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'never',
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
