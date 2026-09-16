import type { LayersConfig } from '../../config';
import { createPlugin } from '../../create-plugin';
import { normalizeLayersConfig } from '../../lib/feature-sliced/layers-config';
import { createImportOrderRuleConfigs, importOrderRuleConfigs } from './configs';

const DEFAULT_LAYERS_REVERSED = ['app', 'processes', 'pages', 'widgets', 'features', 'entities', 'shared'];
const IMPORT_ORDER_RULE_NAME = '@conarti/feature-sliced/import-order';
const CONFIG_NAMES = ['recommended', 'with-newlines', 'with-type-group', 'with-newlines-and-type-group'] as const;

function makePathGroups(layerNames: string[]) {
  return layerNames.map((layer) => ({
    pattern: `**/?(*)${layer}{,/**}`,
    group: 'internal',
    position: 'after',
  }));
}

const BASE_CONFIG = {
  alphabetize: {
    order: 'asc',
    caseInsensitive: true,
  },
  pathGroups: makePathGroups(DEFAULT_LAYERS_REVERSED),
  distinctGroup: false,
  pathGroupsExcludedImportTypes: ['builtin'],
  groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
};

const TYPE_GROUP_CONFIG = {
  pathGroupsExcludedImportTypes: ['builtin', 'type'],
  groups: ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index'],
};

describe('createImportOrderRuleConfigs', () => {
  it('should build the recommended config from the default layers', () => {
    const configs = createImportOrderRuleConfigs();

    expect(configs.recommended).toEqual([
      'error',
      { ...BASE_CONFIG, 'newlines-between': 'never' },
    ]);
  });

  it('should only differ between variants by newlines and type group settings', () => {
    const configs = createImportOrderRuleConfigs();

    expect(configs['with-newlines']).toEqual([
      'error',
      { ...BASE_CONFIG, 'newlines-between': 'always' },
    ]);
    expect(configs['with-type-group']).toEqual([
      'error',
      { ...BASE_CONFIG, ...TYPE_GROUP_CONFIG, 'newlines-between': 'never' },
    ]);
    expect(configs['with-newlines-and-type-group']).toEqual([
      'error',
      { ...BASE_CONFIG, ...TYPE_GROUP_CONFIG, 'newlines-between': 'always' },
    ]);
  });

  it('should order pathGroups from the top layer down for custom layers', () => {
    const configs = createImportOrderRuleConfigs(normalizeLayersConfig(['core', 'domain', { name: 'app', hasSlices: false }]));
    const [, options] = configs.recommended as [string, { pathGroups: unknown }];

    expect(options.pathGroups).toEqual(makePathGroups(['app', 'domain', 'core']));
  });

  it('should expose the default configs through the deprecated constant', () => {
    expect(importOrderRuleConfigs).toEqual(createImportOrderRuleConfigs());
  });
});

describe('createPlugin import-order wiring', () => {
  it.each(CONFIG_NAMES)('should emit the "%s" config when sortImports selects it', (name) => {
    const config = createPlugin({ sortImports: name });

    expect(config.rules![IMPORT_ORDER_RULE_NAME]).toEqual(createImportOrderRuleConfigs()[name]);
  });

  it('should propagate custom layers into the emitted import-order entry', () => {
    const layers: LayersConfig = ['core', 'domain', { name: 'app', hasSlices: false }];

    const config = createPlugin({ layers });
    const [, options] = config.rules![IMPORT_ORDER_RULE_NAME] as [string, { pathGroups: unknown }];

    expect(options.pathGroups).toEqual(makePathGroups(['app', 'domain', 'core']));
    expect(config.rules![IMPORT_ORDER_RULE_NAME]).toEqual(createImportOrderRuleConfigs(normalizeLayersConfig(layers)).recommended);
  });
});
