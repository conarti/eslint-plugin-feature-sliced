import { createPlugin } from './create-plugin';
import { plugin } from './plugin';

export { createPlugin };
export { plugin };
export { layers, PLUGIN_NAME, RULE_NAMES, segments } from './config';
export type { ImportOrderConfigName, Layer, Segment, TypedFlatConfigItem } from './config';
export type { Severity } from './create-plugin';

export default createPlugin;
