import type { TypedFlatConfigItem } from '../../config';
import { PLUGIN_NAME, RULE_NAMES } from '../../config';
import { plugin } from '../../plugin';
import { LAYERS_REVERSED } from './shared';

export const recommended = {
  name: '@conarti/sort-imports/recommended',
  plugins: {
    [PLUGIN_NAME]: plugin,
  },
  rules: {
    [RULE_NAMES.IMPORT_ORDER]: [
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
