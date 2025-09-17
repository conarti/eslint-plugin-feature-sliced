import type { Linter } from 'eslint';
import type { ImportOrderConfigName, TypedFlatConfigItem } from './config';
import type { VALIDATION_LEVEL } from './rules/public-api/config';
import { PLUGIN_NAME, RULE_NAMES } from './config';
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
    const importOrderConfig = importOrder[sortImports];
    const importOrderRuleName = RULE_NAMES.IMPORT_ORDER;

    if (importOrderConfig.rules && importOrderConfig.rules[importOrderRuleName]) {
      rules[importOrderRuleName] = importOrderConfig.rules[importOrderRuleName];
    }
  }

  return rules;
}
