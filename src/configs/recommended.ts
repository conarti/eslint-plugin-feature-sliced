import type { TypedFlatConfigItem } from '../config';
import { PLUGIN_NAME } from '../config';
import { plugin } from '../plugin';
import { importOrder } from './import-order';

const createRuleName = (rule: string): string => `${PLUGIN_NAME}/${rule}`;

const rulesRecommended = {
  plugins: {
    [PLUGIN_NAME]: plugin,
  },
  rules: {
    [createRuleName('layers-slices')]: 'error',
    [createRuleName('absolute-relative')]: 'error',
    [createRuleName('public-api')]: 'error',
  },
} satisfies TypedFlatConfigItem;

const recommended = [
  rulesRecommended,
  importOrder.recommended,
] satisfies TypedFlatConfigItem[];

export default recommended;
