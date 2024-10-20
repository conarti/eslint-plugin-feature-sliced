import type { ImportOrderConfigName, TypedFlatConfigItem } from './config';
import type { VALIDATION_LEVEL } from './rules/public-api/config';
import { mergeConfigs } from 'eslint-flat-config-utils';
import { PLUGIN_NAME } from './config';
import { importOrder } from './configs/import-order';
import { plugin } from './plugin';

interface AbsoluteRelativeOptions {
  /**
   * Disable the rule in certain files
   */
  ignoreInFilesPatterns: string[];
}

interface LayersSlicesOptions {
  /**
   * Ignore cross-imports of types
   * @default true
   */
  allowTypeImports: boolean;
  /**
   * Ignore certain import paths (import foo from '<path-to-ignore>')
   */
  ignorePatterns: string[];
  /**
   * Disable the rule in certain files
   */
  ignoreInFilesPatterns: string[];
}

interface PublicApiOptions {
  /**
   * Adjusts the depth.
   * 'slices' will check for presence 'index' file at the slice level only,
   * 'segments' at the slice and its segments level
   * Default is 'slices', but 'segments' is recommended
   * @default 'slices'
   */
  level: VALIDATION_LEVEL;
  /**
   * Disable the rule in certain files
   */
  ignoreInFilesPatterns: string[];
}

interface ESLintPluginFeatureSlicedOptions {
  sortImports?: false | ImportOrderConfigName;
  absoluteRelative?: AbsoluteRelativeOptions;
  layersSlices?: LayersSlicesOptions;
  publicApi?: PublicApiOptions;
}

export function createPlugin(options: ESLintPluginFeatureSlicedOptions = {}): TypedFlatConfigItem {
  const {
    sortImports = 'recommended',
    absoluteRelative = {},
    layersSlices = {},
    publicApi = {},
  } = options;

  const createRuleName = (rule: string): string => `${PLUGIN_NAME}/${rule}`;

  const config = {
    name: PLUGIN_NAME,
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    rules: {
      [createRuleName('layers-slices')]: ['error', layersSlices],
      [createRuleName('absolute-relative')]: ['error', absoluteRelative],
      [createRuleName('public-api')]: ['error', publicApi],
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
