import type { TypedFlatConfigItem } from '../../config';
import { PLUGIN_NAME, RULE_NAMES } from '../../config';
import { plugin } from '../../plugin';
import { importOrderRuleConfigs } from '../../rules/import-order/configs';

export const recommended = {
  name: '@conarti/feature-sliced/import-order/recommended',
  plugins: {
    [PLUGIN_NAME]: plugin,
  },
  rules: {
    [RULE_NAMES.IMPORT_ORDER]: importOrderRuleConfigs.recommended,
  },
} satisfies TypedFlatConfigItem;
