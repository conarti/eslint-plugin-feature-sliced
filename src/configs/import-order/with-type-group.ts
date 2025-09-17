import type { TypedFlatConfigItem } from '../../config';
import { PLUGIN_NAME, RULE_NAMES } from '../../config';
import { LAYERS_REVERSED } from './shared';
import { plugin } from '../../plugin';

export const withTypeGroup = {
  name: '@conarti/sort-imports/with-type-group',
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
        'pathGroupsExcludedImportTypes': ['builtin', 'type'],
        'groups': ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index'],
      },
    ],
  },
} satisfies TypedFlatConfigItem;
