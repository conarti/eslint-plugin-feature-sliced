import type { SegmentsConfig } from '../../config';
import type { UnknownRuleContext } from './models';
import { PLUGIN_NAME } from '../../config';
import { normalizeSegmentsConfig } from '../feature-sliced/segments-config';

interface PluginSettings {
  segments?: SegmentsConfig;
}

function isValidSegmentsConfig(value: unknown): value is SegmentsConfig {
  if (Array.isArray(value)) {
    return value.every((item) => typeof item === 'string');
  }

  if (typeof value === 'object' && value !== null && 'replace' in value) {
    const replaceValue = (value as { replace: unknown }).replace;
    return Array.isArray(replaceValue) && replaceValue.every((item) => typeof item === 'string');
  }

  return false;
}

/**
 * Extracts segments configuration from context.settings.
 * If no config is provided in settings, returns normalized default config.
 */
export function extractSegmentsConfig(context: UnknownRuleContext): string[] {
  const settings = context.settings as Record<string, unknown> | undefined;
  const pluginSettings = settings?.[PLUGIN_NAME] as PluginSettings | undefined;

  if (pluginSettings?.segments && isValidSegmentsConfig(pluginSettings.segments)) {
    return normalizeSegmentsConfig(pluginSettings.segments);
  }

  return normalizeSegmentsConfig();
}
