import type { LayerConfigItem, LayersConfig, NormalizedLayerConfig } from '../../config';
import type { UnknownRuleContext } from './models';
import { PLUGIN_NAME } from '../../config';
import { normalizeLayersConfig } from '../feature-sliced/layers-config';

interface PluginSettings {
  layers?: unknown;
}

/**
 * Whether the entry can name a layer.
 *
 * A name is what every consumer reads, so an entry that carries none is not a layer with a
 * missing detail, it is not a layer at all. The empty string is rejected with the rest: no
 * path segment is empty, so a layer named that way could never match anything.
 */
function isUsableLayerConfigItem(item: unknown): item is LayerConfigItem {
  if (typeof item === 'string') {
    return item !== '';
  }

  const name = (item as { name?: unknown } | null | undefined)?.name;

  return typeof name === 'string' && name !== '';
}

/**
 * Accepts the same shapes `createPlugin`'s `layers` option accepts, and nothing else.
 *
 * All or nothing, like `isValidSegmentsConfig` next door: a list with one unusable entry is a
 * list that was not written against this plugin, and reading the rest of it would be guessing.
 */
function isValidLayersConfig(value: unknown): value is LayersConfig {
  return Array.isArray(value) && value.every(isUsableLayerConfigItem);
}

/**
 * Extracts layers configuration from context.settings.
 * If no config is provided in settings, returns normalized default config.
 *
 * This is the only place the layers setting is read, so it is the only place that can
 * guarantee the shape every consumer downstream expects. `createPlugin` writes an already
 * normalized list, but the setting is plain ESLint configuration and can be written by hand,
 * and by hand it is written as a list of layer names. Handing that list on untouched gives
 * every consumer a list of layers whose name is undefined: the rules stop recognizing any
 * layer, and the ones that lowercase the name abandon the file with a TypeError.
 *
 * A list that is not usable at all falls back to the defaults rather than throwing, because a
 * rule has no way to reject configuration except by throwing, and throwing is the failure this
 * guard exists to remove. `segments` is read the same way three lines away.
 */
export function extractLayersConfig(context: UnknownRuleContext): NormalizedLayerConfig[] {
  const settings = context.settings as Record<string, unknown> | undefined;
  const pluginSettings = settings?.[PLUGIN_NAME] as PluginSettings | undefined;
  const layers = pluginSettings?.layers;

  if (isValidLayersConfig(layers)) {
    return normalizeLayersConfig(layers);
  }

  return normalizeLayersConfig();
}
