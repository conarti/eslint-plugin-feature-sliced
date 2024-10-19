import type { ImportOrderConfigName, TypedFlatConfigItem } from './config';
import { mergeConfigs } from 'eslint-flat-config-utils';
import { PLUGIN_NAME } from './config';
import { importOrder } from './configs/import-order';
import { plugin } from './plugin';

interface ESLintPluginFeatureSlicedOptions {
  /**
   * Import sorting type. Use 'false' to disable.
   * @default 'recommended'
   */
  sortImports?: false | ImportOrderConfigName;
}

export function createPlugin(options: ESLintPluginFeatureSlicedOptions = {}): TypedFlatConfigItem {
  const {
    sortImports = 'recommended',
  } = options;

  const createRuleName = (rule: string): string => `${PLUGIN_NAME}/${rule}`;

  const config = {
    name: PLUGIN_NAME,
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    rules: {
      [createRuleName('layers-slices')]: 'error',
      [createRuleName('absolute-relative')]: 'error',
      [createRuleName('public-api')]: 'error',
    },
  } satisfies TypedFlatConfigItem;

  const withSortImports = setupSortImports(config, sortImports);
  return withSortImports;
}

function setupSortImports(
  config: TypedFlatConfigItem,
  importOrderConfigName?: ESLintPluginFeatureSlicedOptions['sortImports'],
): TypedFlatConfigItem {
  if (!importOrderConfigName) {
    return config;
  }

  const importOrderConfig = importOrder[importOrderConfigName];

  return mergeConfigs(
    importOrderConfig,
    config, // the last one is to set the configuration name as 'PLUGIN_NAME'
  );
}
