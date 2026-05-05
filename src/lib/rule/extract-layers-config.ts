import type { NormalizedLayerConfig } from '../../config';
import type { UnknownRuleContext } from './models';
import { PLUGIN_NAME } from '../../config';
import { normalizeLayersConfig } from '../feature-sliced/layers-config';

interface PluginSettings {
  layers?: NormalizedLayerConfig[];
}

/**
 * Extracts layers configuration from context.settings.
 * If no config is provided in settings, returns normalized default config.
 */
export function extractLayersConfig(context: UnknownRuleContext): NormalizedLayerConfig[] {
  const settings = context.settings as Record<string, unknown> | undefined;
  const pluginSettings = settings?.[PLUGIN_NAME] as PluginSettings | undefined;

  if (pluginSettings?.layers && Array.isArray(pluginSettings.layers)) {
    return pluginSettings.layers;
  }

  return normalizeLayersConfig();
}
