import type { Linter } from 'eslint';
import type { ImportOrderConfigName, TypedFlatConfigItem } from './config';
import type { ValidationLevel } from './rules/public-api/config';
import { PLUGIN_NAME, RULE_NAMES } from './config';
import { plugin } from './plugin';
import { importOrderRuleConfigs } from './rules/import-order/configs';

interface AbsoluteRelativeOptions {
  /**
   * Ignore certain import paths (import foo from '<path-to-ignore>')
   */
  ignoreImports: string[];
  /**
   * Disable the rule in certain files
   */
  ignoreFiles: string[];
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
  ignoreImports: string[];
  /**
   * Disable the rule in certain files
   */
  ignoreFiles: string[];
}

interface PublicApiOptions {
  /**
   * Adjusts the depth.
   * 'slices' will check for presence 'index' file at the slice level only,
   * 'segments' at the slice and its segments level
   * Default is 'slices', but 'segments' is recommended
   * @default 'slices'
   */
  level: ValidationLevel;
  /**
   * Ignore certain import paths (import foo from '<path-to-ignore>')
   */
  ignoreImports: string[];
  /**
   * Disable the rule in certain files
   */
  ignoreFiles: string[];
}

interface ESLintPluginFeatureSlicedOptions {
  absoluteRelative?: false | AbsoluteRelativeOptions;
  layersSlices?: false | LayersSlicesOptions;
  publicApi?: false | PublicApiOptions;
  sortImports?: false | ImportOrderConfigName;
}

export function createPlugin(options: ESLintPluginFeatureSlicedOptions = {}): TypedFlatConfigItem {
  const {
    sortImports = 'recommended',
    absoluteRelative,
    layersSlices,
    publicApi,
  } = options;

  const rules = defineRules({ absoluteRelative, layersSlices, publicApi, sortImports });

  return {
    name: PLUGIN_NAME,
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    rules,
  } satisfies TypedFlatConfigItem;
}

function defineRules(options: ESLintPluginFeatureSlicedOptions): Linter.RulesRecord {
  const {
    absoluteRelative = {},
    layersSlices = {},
    publicApi = {},
    sortImports = 'recommended',
  } = options;

  const createRuleEntry = <T>(ruleOptions: T | false): Linter.RuleEntry<T[]> => ruleOptions ? ['error', ruleOptions] : ['off'];

  const rules: Linter.RulesRecord = {
    [RULE_NAMES.LAYERS_SLICES]: createRuleEntry(layersSlices),
    [RULE_NAMES.ABSOLUTE_RELATIVE]: createRuleEntry(absoluteRelative),
    [RULE_NAMES.PUBLIC_API]: createRuleEntry(publicApi),
  };

  if (sortImports) {
    rules[RULE_NAMES.IMPORT_ORDER] = importOrderRuleConfigs[sortImports];
  }

  return rules;
}
