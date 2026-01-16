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
  it('should return default config when no settings provided', () => {
    const context = createMockContext();
    const result = extractLayersConfig(context);

    expect(result).toHaveLength(7);
    expect(result[0]).toEqual({ name: 'shared', hasSlices: false, allowSliceCrossImports: false });
    expect(result[6]).toEqual({ name: 'app', hasSlices: false, allowSliceCrossImports: false });
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
      { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
      { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
      { name: 'app', hasSlices: false, allowSliceCrossImports: false },
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
});
