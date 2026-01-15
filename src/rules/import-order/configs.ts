import type { Linter } from 'eslint';
import type { NormalizedLayerConfig } from '../../config';
import { getLayerNames, normalizeLayersConfig } from '../../lib/feature-sliced/layers-config';

export type ImportOrderRuleConfig = Linter.RuleEntry;

/**
 * Creates pathGroups for import-order rule based on layers config
 */
function createPathGroups(layerNames: string[]) {
  const reversed = [...layerNames].reverse();
  return reversed.map((layer) => ({
    pattern: `**/?(*)${layer}{,/**}`,
    group: 'internal' as const,
    position: 'after' as const,
  }));
}

/**
 * Creates base configuration for import-order rule
 */
function createBaseConfig(layerNames: string[]) {
  return {
    alphabetize: {
      order: 'asc' as const,
      caseInsensitive: true,
    },
    pathGroups: createPathGroups(layerNames),
    distinctGroup: false,
    pathGroupsExcludedImportTypes: ['builtin'],
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  };
}

/**
 * Creates import order rule configurations based on layers config.
 * If no config provided, uses default FSD layers.
 */
export function createImportOrderRuleConfigs(config?: NormalizedLayerConfig[]) {
  const layersConfig = config ?? normalizeLayersConfig();
  const layerNames = getLayerNames(layersConfig);
  const baseConfig = createBaseConfig(layerNames);

  return {
    'recommended': [
      'error',
      {
        ...baseConfig,
        'newlines-between': 'never',
      },
    ] as ImportOrderRuleConfig,

    'with-newlines': [
      'error',
      {
        ...baseConfig,
        'newlines-between': 'always',
      },
    ] as ImportOrderRuleConfig,

    'with-type-group': [
      'error',
      {
        ...baseConfig,
        'newlines-between': 'never',
        'pathGroupsExcludedImportTypes': ['builtin', 'type'],
        'groups': ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index'],
      },
    ] as ImportOrderRuleConfig,

    'with-newlines-and-type-group': [
      'error',
      {
        ...baseConfig,
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': ['builtin', 'type'],
        'groups': ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index'],
      },
    ] as ImportOrderRuleConfig,
  };
}

/**
 * Default import order rule configurations using default FSD layers.
 * @deprecated Use createImportOrderRuleConfigs() for custom layers support
 */
export const importOrderRuleConfigs = createImportOrderRuleConfigs();
