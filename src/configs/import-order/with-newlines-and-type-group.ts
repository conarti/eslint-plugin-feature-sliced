import type { TypedFlatConfigItem } from '../../config';
import { layers } from '../../config';
import { plugins } from './plugins';

const LAYERS_REVERSED = [...layers].reverse();

export const withNewlinesAndTypeGroup = {
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
