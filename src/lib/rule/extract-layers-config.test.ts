import type { NormalizedLayerConfig } from '../../config';
import type { UnknownRuleContext } from './models';
import { PLUGIN_NAME } from '../../config';
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

    it('should return default config when a name is the empty string', () => {
      expect(extractFrom([''])).toHaveLength(7);
    });

    it('should return default config when an object entry has an empty name', () => {
      expect(extractFrom([{ name: '' }])).toHaveLength(7);
    });

    it('should return default config when layers is null', () => {
      expect(extractFrom(null)).toHaveLength(7);
    });
  });
});
