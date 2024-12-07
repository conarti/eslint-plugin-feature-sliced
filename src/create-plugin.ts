import type { Linter } from 'eslint';
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

interface ESLintPluginFeatureSlicedRuleOptions {
  absoluteRelative?: false | AbsoluteRelativeOptions;
  layersSlices?: false | LayersSlicesOptions;
  publicApi?: false | PublicApiOptions;
}

interface ESLintPluginFeatureSlicedOptions extends ESLintPluginFeatureSlicedRuleOptions {
  sortImports?: false | ImportOrderConfigName;
}

export function createPlugin(options: ESLintPluginFeatureSlicedOptions = {}): TypedFlatConfigItem {
  const {
    sortImports = 'recommended',
    absoluteRelative,
    layersSlices,
    publicApi,
  } = options;

  const rules = defineRules({ absoluteRelative, layersSlices, publicApi });

  const config = {
    name: PLUGIN_NAME,
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    rules,
  } satisfies TypedFlatConfigItem;

  return setupSortImports(config, sortImports);
}

function defineRules(options: ESLintPluginFeatureSlicedRuleOptions): Linter.RulesRecord {
  const {
    absoluteRelative = {},
    layersSlices = {},
    publicApi = {},
  } = options;

  const createRuleName = (rule: string): string => `${PLUGIN_NAME}/${rule}`;
  const createRuleEntry = <T>(ruleOptions: T | false): Linter.RuleEntry<T[]> => ruleOptions ? ['error', ruleOptions] : ['off'];

  const rules = {
    [createRuleName('layers-slices')]: createRuleEntry(layersSlices),
    [createRuleName('absolute-relative')]: createRuleEntry(absoluteRelative),
    [createRuleName('public-api')]: createRuleEntry(publicApi),
  } satisfies Linter.RulesRecord;

  return rules;
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
