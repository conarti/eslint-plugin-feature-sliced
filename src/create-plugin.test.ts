import type { NormalizedLayerConfig } from './config';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPlugin } from './create-plugin';
import * as indexModule from './index';
import { normalizeLayersConfig } from './lib/feature-sliced/layers-config';
import { plugin } from './plugin';

/**
 * Settings shape written by createPlugin() under the plugin key, cast because
 * eslint's Linter.Config types `settings` as Record<string, unknown>.
 */
interface PluginSettings {
  layers: NormalizedLayerConfig[];
  segments?: string[];
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(path.resolve(currentDir, '../package.json'), 'utf8')) as { version: string };

describe('createPlugin', () => {
  it('enables exactly the five own rules, keyed by their configured names', () => {
    const config = createPlugin();

    expect(Object.keys(config.rules!)).toEqual([
      '@conarti/feature-sliced/layers-slices',
      '@conarti/feature-sliced/absolute-relative',
      '@conarti/feature-sliced/public-api',
      '@conarti/feature-sliced/no-cross-segment-reexport',
      '@conarti/feature-sliced/import-order',
    ]);
  });

  it('defaults every own rule to error severity and switches all of them to warn via options.severity', () => {
    const defaultConfig = createPlugin();
    const warnConfig = createPlugin({ severity: 'warn' });

    const ownRuleNames = [
      '@conarti/feature-sliced/layers-slices',
      '@conarti/feature-sliced/absolute-relative',
      '@conarti/feature-sliced/public-api',
      '@conarti/feature-sliced/no-cross-segment-reexport',
    ];

    for (const ruleName of ownRuleNames) {
      expect(defaultConfig.rules![ruleName]).toEqual(['error', {}]);
      expect(warnConfig.rules![ruleName]).toEqual(['warn', {}]);
    }
  });

  it('overrides the global severity for a single rule while the rest keep the override', () => {
    const config = createPlugin({ severity: 'warn', publicApi: { severity: 'error' } });

    expect(config.rules!['@conarti/feature-sliced/public-api']).toEqual(['error', {}]);
    expect(config.rules!['@conarti/feature-sliced/layers-slices']).toEqual(['warn', {}]);
    expect(config.rules!['@conarti/feature-sliced/absolute-relative']).toEqual(['warn', {}]);
    expect(config.rules!['@conarti/feature-sliced/no-cross-segment-reexport']).toEqual(['warn', {}]);
  });

  it('turns layersSlices off when set to false', () => {
    const config = createPlugin({ layersSlices: false });

    expect(config.rules!['@conarti/feature-sliced/layers-slices']).toBe('off');
  });

  it('turns absoluteRelative off when set to false', () => {
    const config = createPlugin({ absoluteRelative: false });

    expect(config.rules!['@conarti/feature-sliced/absolute-relative']).toBe('off');
  });

  it('turns publicApi off when set to false', () => {
    const config = createPlugin({ publicApi: false });

    expect(config.rules!['@conarti/feature-sliced/public-api']).toBe('off');
  });

  it('turns noCrossSegmentReexport off when set to false', () => {
    const config = createPlugin({ noCrossSegmentReexport: false });

    expect(config.rules!['@conarti/feature-sliced/no-cross-segment-reexport']).toBe('off');
  });

  it('omits the import-order rule when sortImports is false, leaving the four own rules', () => {
    const config = createPlugin({ sortImports: false });

    expect(Object.keys(config.rules!)).toEqual([
      '@conarti/feature-sliced/layers-slices',
      '@conarti/feature-sliced/absolute-relative',
      '@conarti/feature-sliced/public-api',
      '@conarti/feature-sliced/no-cross-segment-reexport',
    ]);
  });

  it('normalizes the layers setting by default and when a custom layers config is passed', () => {
    const customLayers = [{ name: 'shared', hasSlices: false }, 'entities'];

    const defaultConfig = createPlugin();
    const customConfig = createPlugin({ layers: customLayers });

    const defaultSettings = defaultConfig.settings!['@conarti/feature-sliced'] as PluginSettings;
    const customSettings = customConfig.settings!['@conarti/feature-sliced'] as PluginSettings;

    expect(defaultSettings.layers).toEqual(normalizeLayersConfig());
    expect(customSettings.layers).toEqual(normalizeLayersConfig(customLayers));
  });

  it('keeps segments out of settings by default and passes them through verbatim when provided', () => {
    const defaultConfig = createPlugin();
    const customConfig = createPlugin({ segments: ['services'] });

    const defaultSettings = defaultConfig.settings!['@conarti/feature-sliced'] as PluginSettings;
    const customSettings = customConfig.settings!['@conarti/feature-sliced'] as PluginSettings;

    expect(defaultSettings).not.toHaveProperty('segments');
    expect(customSettings.segments).toEqual(['services']);
  });

  it('names the config after the plugin and shares the same plugin instance', () => {
    const config = createPlugin();

    expect(config.name).toBe('@conarti/feature-sliced');
    expect(config.plugins!['@conarti/feature-sliced']).toBe(plugin);
  });
});

describe('plugin meta (P9)', () => {
  it('pins the plugin meta name and version', () => {
    expect(plugin.meta.name).toBe('@conarti/feature-sliced');
    expect(plugin.meta.version).toBe(packageJson.version);
  });

  it('pins the order of rules exposed on the plugin object', () => {
    expect(Object.keys(plugin.rules)).toEqual([
      'absolute-relative',
      'import-order',
      'layers-slices',
      'no-cross-segment-reexport',
      'public-api',
    ]);
  });
});

describe('src/index.ts public API (P9)', () => {
  it('re-exports createPlugin, plugin, layers, segments, PLUGIN_NAME, RULE_NAMES and a matching default export', () => {
    expect(indexModule.createPlugin).toBe(createPlugin);
    expect(indexModule.plugin).toBe(plugin);
    expect(indexModule.layers).toBeDefined();
    expect(indexModule.segments).toBeDefined();
    expect(indexModule.PLUGIN_NAME).toBe('@conarti/feature-sliced');
    expect(indexModule.RULE_NAMES).toBeDefined();
    expect(indexModule.default).toBe(createPlugin);
  });
});
