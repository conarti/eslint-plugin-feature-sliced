import type { LayersConfig, NormalizedLayerConfig, TypedFlatConfigItem } from '../../config';
import type { UnknownRuleContext } from './models';
import { DEFAULT_LAYERS_CONFIG, PLUGIN_NAME } from '../../config';
import { createPlugin } from '../../create-plugin';
import { extractLayersConfig } from './extract-layers-config';

function createMockContext(settings?: Record<string, unknown>): UnknownRuleContext {
  return {
    settings: settings ?? {},
  } as unknown as UnknownRuleContext;
}

describe('extractLayersConfig', () => {
  it('should fall back to the default seven-layer config when the context has no settings', () => {
    const context = createMockContext();
    const result = extractLayersConfig(context);

    expect(result).toHaveLength(7);
    expect(result[0]).toEqual({ name: 'shared', hasSlices: false });
    expect(result[6]).toEqual({ name: 'app', hasSlices: false });
  });

  it('should return default config when plugin settings are empty', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {},
    });
    const result = extractLayersConfig(context);

    expect(result).toHaveLength(7);
  });

  it('should return custom layers from settings', () => {
    const customLayers: NormalizedLayerConfig[] = [
      { name: 'shared', hasSlices: false },
      { name: 'entities', hasSlices: true },
      { name: 'app', hasSlices: false },
    ];

    const context = createMockContext({
      [PLUGIN_NAME]: {
        layers: customLayers,
      },
    });

    const result = extractLayersConfig(context);
    expect(result).toEqual(customLayers);
  });

  it('should return default config when layers is not an array', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {
        layers: 'not-an-array',
      },
    });

    const result = extractLayersConfig(context);
    expect(result).toHaveLength(7);
  });

  it('should return default config when settings is undefined', () => {
    const context = { settings: undefined } as unknown as UnknownRuleContext;
    const result = extractLayersConfig(context);

    expect(result).toHaveLength(7);
  });

  it('should handle settings without plugin key', () => {
    const context = createMockContext({
      someOtherPlugin: { foo: 'bar' },
    });

    const result = extractLayersConfig(context);
    expect(result).toHaveLength(7);
  });

  /*
   * The setting is plain ESLint configuration, so it is written by hand as often as it is
   * written by createPlugin, and by hand it is written in the shape the `layers` option takes.
   */
  describe('a list that createPlugin did not write', () => {
    function extractFrom(layers: unknown) {
      return extractLayersConfig(createMockContext({
        [PLUGIN_NAME]: { layers },
      }));
    }

    it('should normalize a plain list of layer names', () => {
      expect(extractFrom(['shared', 'entities', 'app'])).toEqual([
        { name: 'shared', hasSlices: true },
        { name: 'entities', hasSlices: true },
        { name: 'app', hasSlices: true },
      ]);
    });

    it('should normalize a list that mixes names and objects', () => {
      expect(extractFrom([{ name: 'Shared', hasSlices: false }, 'Entities'])).toEqual([
        { name: 'shared', hasSlices: false },
        { name: 'entities', hasSlices: true },
      ]);
    });

    it('should leave an already normalized list unchanged', () => {
      const normalized: NormalizedLayerConfig[] = [
        { name: 'shared', hasSlices: false },
        { name: 'entities', hasSlices: true },
      ];

      expect(extractFrom(normalized)).toEqual(normalized);
    });

    it('should honour an empty list as a project with no layers', () => {
      expect(extractFrom([])).toEqual([]);
    });

    it('should return default config when an entry is neither a name nor an object', () => {
      expect(extractFrom(['shared', 42])).toHaveLength(7);
    });

    it('should return default config when an entry is null', () => {
      expect(extractFrom(['shared', null])).toHaveLength(7);
    });

    it('should return default config when an object entry carries no name', () => {
      expect(extractFrom([{ hasSlices: true }])).toHaveLength(7);
    });

    it('should return default config when an object entry has a name that is not a string', () => {
      expect(extractFrom([{ name: 42 }])).toHaveLength(7);
    });

    /*
     * An empty name is a poor name and not one anybody writes on purpose, but createPlugin
     * accepts it and writes it into this setting, so the read has to accept it too. Rejecting
     * it here is how a factory configured project ends up linting against the defaults.
     */
    it('should honour a name that is the empty string', () => {
      expect(extractFrom([''])).toEqual([{ name: '', hasSlices: true }]);
    });

    it('should honour an object entry whose name is the empty string', () => {
      expect(extractFrom([{ name: '' }])).toEqual([{ name: '', hasSlices: true }]);
    });

    it('should return default config when layers is null', () => {
      expect(extractFrom(null)).toHaveLength(7);
    });
  });

  /*
   * The setting is written by createPlugin as often as it is written by hand, and the guard has
   * to accept everything the factory can put there. Where it does not, a project configured
   * through the factory silently lints against the default layers instead of its own, which is
   * the one failure a guard placed at the read cannot be allowed to introduce.
   */
  describe('a list that createPlugin wrote', () => {
    function writtenLayers(config: TypedFlatConfigItem): NormalizedLayerConfig[] {
      return (config.settings![PLUGIN_NAME] as { layers: NormalizedLayerConfig[] }).layers;
    }

    function readBack(written: NormalizedLayerConfig[]): NormalizedLayerConfig[] {
      return extractLayersConfig(createMockContext({
        [PLUGIN_NAME]: { layers: written },
      }));
    }

    const factoryOptions: Array<[string, LayersConfig | undefined]> = [
      ['no layers option at all', undefined],
      ['an empty list', []],
      ['a single layer name', ['shared']],
      ['plain layer names', ['shared', 'entities', 'app']],
      ['layer names in mixed case', ['Shared', 'ENTITIES']],
      ['objects that set hasSlices both ways', [{ name: 'shared', hasSlices: false }, { name: 'entities', hasSlices: true }]],
      ['an object that leaves hasSlices out', [{ name: 'app' }]],
      ['names and objects in one list', [{ name: 'Shared', hasSlices: false }, 'Entities']],
      ['the default list spelled out', DEFAULT_LAYERS_CONFIG],
      ['an empty name written as a string', ['shared', 'entities', '']],
      ['an empty name written on an object', [{ name: '' }]],
      ['an empty name and nothing else', ['']],
    ];

    it.each(factoryOptions)('should read back exactly what createPlugin writes for %s', (_label, layers) => {
      const written = writtenLayers(createPlugin({ layers }));

      expect(readBack(written)).toEqual(written);
    });

    /*
     * hasSlices is checked by neither door. The claim here is not that a non boolean is
     * sensible, it is that both doors treat it identically, so the setting cannot mean one
     * thing through the factory and another by hand.
     */
    it('should carry a hasSlices that is not a boolean the same way through both doors', () => {
      const layers = [{ name: 'shared', hasSlices: 'no' }] as unknown as LayersConfig;
      const written = writtenLayers(createPlugin({ layers }));

      expect(written).toEqual([{ name: 'shared', hasSlices: 'no' }]);
      expect(readBack(written)).toEqual(written);
    });
  });
});
