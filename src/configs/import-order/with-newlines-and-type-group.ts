import type { TypedFlatConfigItem } from '../../config';
import { PLUGIN_NAME, RULE_NAMES } from '../../config';
import { plugin } from '../../plugin';
import { LAYERS_REVERSED } from './shared';

export const withNewlinesAndTypeGroup = {
  name: '@conarti/sort-imports/with-newlines-and-type-group',
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
