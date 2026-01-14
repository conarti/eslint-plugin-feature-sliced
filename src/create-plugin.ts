import type { Linter } from 'eslint';
import type {
  ImportOrderConfigName,
  LayersConfig,
  NormalizedLayerConfig,
  TypedFlatConfigItem,
} from './config';
import type { ValidationLevel } from './rules/public-api/config';
import { PLUGIN_NAME, RULE_NAMES } from './config';
import { normalizeLayersConfig } from './lib/feature-sliced/layers-config';
import { plugin } from './plugin';
import { createImportOrderRuleConfigs } from './rules/import-order/configs';

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
  /**
   * Custom layers configuration.
   * Supports mixed syntax: strings for layers with slices, objects for customization.
   * @example
   * layers: [
   *   { name: 'shared', hasSlices: false },
   *   'entities',
   *   'features',
   *   'widgets',
   *   'pages',
   *   { name: 'app', hasSlices: false },
   * ]
   */
  layers?: LayersConfig;
  absoluteRelative?: false | AbsoluteRelativeOptions;
  layersSlices?: false | LayersSlicesOptions;
  publicApi?: false | PublicApiOptions;
  sortImports?: false | ImportOrderConfigName;
}

export function createPlugin(options: ESLintPluginFeatureSlicedOptions = {}): TypedFlatConfigItem {
  const {
    layers,
    sortImports = 'recommended',
    absoluteRelative,
    layersSlices,
    publicApi,
  } = options;

  const normalizedLayers = normalizeLayersConfig(layers);
  const rules = defineRules({ absoluteRelative, layersSlices, publicApi, sortImports }, normalizedLayers);

  return {
    name: PLUGIN_NAME,
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    settings: {
      [PLUGIN_NAME]: {
        layers: normalizedLayers,
      },
    },
    rules,
  } satisfies TypedFlatConfigItem;
}

function defineRules(
  options: ESLintPluginFeatureSlicedOptions,
  layersConfig: NormalizedLayerConfig[],
): Linter.RulesRecord {
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
    const importOrderConfigs = createImportOrderRuleConfigs(layersConfig);
    rules[RULE_NAMES.IMPORT_ORDER] = importOrderConfigs[sortImports];
  }

  return rules;
}
